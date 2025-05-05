import Timetable from "../models/timetableModel.js";
import userCourseSchema from "../models/userCourseModel.js";
import Course from "../models/courseModel.js";
import mongoose from "mongoose";
import { timetableCacheHelper } from "../utils/timetableCacheHelper.js";

const getTimetable = async (req, res) => {
  try {
    const { id } = req.user;
    const userCourses = await userCourseSchema
      .findOne({ user: id })
      .populate({ path: "courseRegistered", select: "code section" });
    const query = userCourses?.courseRegistered
      ? userCourses.courseRegistered.map((course) => {
          return {
            day: new Date().getDay(),
            subject: course.code,
            section: course.section,
          };
        })
      : [];

    const instructorCourses = await Course.find({ instructor: id });
    const instructorCoursesQuery = instructorCourses.map((course) => {
      return {
        day: new Date().getDay(),
        subject: course.code,
        section: course.section,
      };
    });
    query.push(...instructorCoursesQuery);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!query.length) {
      return res.status(200).json([]);
    }

    const timetable = await Timetable.find({
      $or: query.map((q) => ({
        ...q,
        $or: [
          { date: today }, // Match today's date
          { date: "null" }, // Or date is null
        ],
      })),
    });
    res.status(200).json(timetable);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const getAllTimetables = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 5; // Items per page
    const skip = (page - 1) * limit;

    const [timetables, total] = await Promise.all([
      Timetable.find().skip(skip).limit(limit).lean(),
      Timetable.countDocuments(),
    ]);

    res.status(200).json({
      timetables,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimetable = async (req, res) => {
  const timetable = req.body;

  try {
    const { date, day, startTime, endTime, section, subject, roomNo } =
      timetable;

    // Check for overlapping classes in the same room at the same time
    const overlappingTimetable = await Timetable.findOne({
      roomNo,
      day,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check if time ranges overlap
        { startTime: { $eq: startTime }, endTime: { $eq: endTime } }, // Check if exact match
      ],
    });

    if (overlappingTimetable) {
      return res.status(409).json({
        message: "Room is already booked for the selected time slot.",
      });
    }

    const data = {
      date,
      day,
      startTime,
      endTime,
      section,
      subject,
      roomNo,
    };

    // Now create a new timetable entry
    const newTimetable = new Timetable(data);
    await newTimetable.save();

    // Invalidate caches after successful creation
    await timetableCacheHelper.invalidateAllTimetableCaches();

    // Invalidate specific caches
    if (date && date !== "null") {
      await timetableCacheHelper.invalidateDateSpecificCache(date);
    }
    await timetableCacheHelper.invalidateRoomSpecificCache(roomNo);
    await timetableCacheHelper.invalidateCourseSpecificCache(subject, section);

    res.status(201).json(newTimetable);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateTimetable = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No timetable with that id");
  }

  try {
    // Get the original timetable before updating
    const originalTimetable = await Timetable.findById(id);

    if (!originalTimetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const updatedTimetable = await Timetable.findByIdAndUpdate(
      id,
      { ...updatedData, id },
      { new: true },
    );

    // Invalidate caches after successful update
    await timetableCacheHelper.invalidateAllTimetableCaches();

    // Invalidate specific caches for old and new values
    if (originalTimetable.date && originalTimetable.date !== "null") {
      await timetableCacheHelper.invalidateDateSpecificCache(
        originalTimetable.date,
      );
    }
    if (updatedData.date && updatedData.date !== "null") {
      await timetableCacheHelper.invalidateDateSpecificCache(updatedData.date);
    }

    // Invalidate room caches for both old and new rooms
    await timetableCacheHelper.invalidateRoomSpecificCache(
      originalTimetable.roomNo,
    );
    if (updatedData.roomNo) {
      await timetableCacheHelper.invalidateRoomSpecificCache(
        updatedData.roomNo,
      );
    }

    // Invalidate course caches for both old and new courses
    await timetableCacheHelper.invalidateCourseSpecificCache(
      originalTimetable.subject,
      originalTimetable.section,
    );
    if (updatedData.subject && updatedData.section) {
      await timetableCacheHelper.invalidateCourseSpecificCache(
        updatedData.subject,
        updatedData.section,
      );
    }

    res.status(200).json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTimetable = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No timetable with that id");
  }

  try {
    const deletedTimetable = await Timetable.findOneAndDelete({ _id: id });

    if (!deletedTimetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Invalidate caches after successful deletion
    await timetableCacheHelper.invalidateAllTimetableCaches();

    // Invalidate specific caches
    if (deletedTimetable.date && deletedTimetable.date !== "null") {
      await timetableCacheHelper.invalidateDateSpecificCache(
        deletedTimetable.date,
      );
    }
    await timetableCacheHelper.invalidateRoomSpecificCache(
      deletedTimetable.roomNo,
    );
    await timetableCacheHelper.invalidateCourseSpecificCache(
      deletedTimetable.subject,
      deletedTimetable.section,
    );

    res.json({ message: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getAllTimetables,
};
