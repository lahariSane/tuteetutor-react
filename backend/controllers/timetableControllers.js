import Timetable from "../models/timetableModel.js";
import userCourseSchema from "../models/userCourseModel.js";
import Course from "../models/courseModel.js";
import mongoose from "mongoose";

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
    const timetables = await Timetable.find();
    console.log(timetables)
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimetable = async (req, res) => {
  const timetable = req.body;

  try {
    const data = {
      date: timetable.date,
      day: timetable.day,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      section: timetable.section,
      subject: timetable.subject,
      roomNo: timetable.roomNo,
    };
    const existingTimetable = await Timetable.findOne(data);
    if (existingTimetable) {
      return res
        .status(409)
        .json({
          message:
            "Duplicate timetable entry: A timetable with the same day, start time, and end time already exists.",
        });
    }

    const newTimetable = new Timetable(data);
    await newTimetable.save();
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
    const updatedTimetable = await Timetable.findByIdAndUpdate(
      id,
      { ...updatedData, id },
      { new: true }
    );

    if (!updatedTimetable) {
      return res.status(404).json({ message: "Timetable not found" });
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

    res.json({ message: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getTimetable, createTimetable, updateTimetable, deleteTimetable, getAllTimetables };