import Announcements from "../models/announcementModel.js";
import User from "../models/userModule.js";
import Course from "../models/courseModel.js";
import userCourseSchema from "../models/userCourseModel.js";

const getAnnouncements = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    let courses;

    if (role === "faculty") {
      courses = await Course.find({ instructor: userId });
    } else if (role === "hod") {
      courses = await Course.find({ type: "hod", instructor: userId });

      if (courses.length > 0) {
        const courseNames = courses.map((course) => course.name);
        courses = await Course.find({
          $or: [
            { name: { $in: courseNames }, type: { $ne: "hod" } }, // Existing condition
            { instructor: req.user.id }, // New condition to include courses where the user is an instructor
          ],
        });
      }
    } else {
      courses = await userCourseSchema
        .findOne({ user: userId })
        .populate("courseRegistered");
      courses = courses.courseRegistered;
    }

    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for the user." });
    }

    // Get all announcements for the courses the user is associated with
    const courseIds = courses.map((course) => course._id);
    const announcements = await Announcements.find({
      course: { $in: courseIds },
    }).populate("course", "name section");

    res.status(200).json(announcements);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const createAnnouncement = async (req, res) => {
  const { courseId, description, authorId } = req.body;
  const user = await User.findById(authorId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user is the instructor of the specific course
  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    return res.status(403).json({ message: "Course not found" });
  }

  if (
    user.role === "faculty" &&
    course.instructor.toString() !== user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "User is not an instructor of the provided course" });
  } else if (
    user.role === "hod" &&
    course.instructor.toString() !== user._id.toString()
  ) {
    const hodCourses = await Course.find({ instructor: user._id, type: "hod" });
    const courseCodeMatches = hodCourses.some(
      (hodCourse) => hodCourse.code === course.code
    );

    if (!courseCodeMatches) {
      return res.status(403).json({
        message:
          "User is not an HOD of the provided course or course code does not match",
      });
    }
  }

  // Create a new announcement if the user is indeed the instructor of the given course
  const newAnnouncement = new Announcements({
    title: `${course.name} - ${course.section}`,
    description: description,
    authorId: authorId,
    author: user.name,
    course: course._id,
  });

  try {
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No announcement with that id");
  await Announcements.findByIdAndRemove(id);
  res.json({ message: "Announcement deleted successfully" });
};

export { getAnnouncements, createAnnouncement, deleteAnnouncement };
