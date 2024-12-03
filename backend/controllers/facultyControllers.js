import userModule from "../models/userModule.js";
import Course from "../models/courseModel.js";
import UserCourse from "../models/userCourseModel.js";

const getUsers = async (req, res) => {
  try {
    const users = await userModule.find({
      $or: [{ role: "faculty" }, { role: "student" }],
      _id: { $ne: req.user.id },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getFacultyCourses = async (req, res) => {
  try {
    const { id, code } = req.query;
    const query = id ? { instructor: id } : {};
    if (code) query.code = code;
    const facultyCourses = await Course.find(query).populate({
      path: "instructor",
      select: "name profileImage email",
    });
    res.status(200).json(facultyCourses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getHodCourse = async (req, res) => {
  try {
    const hodCourse = await Course.find({
      type: "hod",
      instructor: req.user.id,
    });
    res.status(200).json(hodCourse);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const getFaculty = async (req, res) => {
  try {
    const user = req.user; // Authenticated user
    let code = null; // Initialize code variable
    const query = {};

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Handle HOD role
    if (user.role === "hod") {
      const hodCourse = await Course.findOne({
        type: "hod",
        instructor: user.id,
      });

      if (!hodCourse) {
        return res.status(200).json({ message: "No course found for HOD." });
      }

      code = hodCourse.code;
    }
    // Handle Student role
    else if (user.role === "student") {
      const studentData = await UserCourse.findOne({ user: user.id }).populate({
        path: "courseRegistered",
        populate: { path: "instructor", select: "name profileImage email" },
      });
      if (!studentData) {
        return res
          .status(200)
          .json({ message: "No registered courses found for the student." });
      }

      return res.status(200).json(studentData.courseRegistered);
    }
    else if (user.role === "faculty") {
      return res
        .status(200)
        .json({ message: "No registered courses found for the faculty." });
    }
    // If code is available, add it to the query
    if (code) {
      query.code = code;
      query.type = { $ne: "hod" };
    }

    // Fetch faculty courses
    const facultyCourses = await Course.find(query).populate({
      path: "instructor",
      select: "name profileImage email",
    });

    if (!facultyCourses.length) {
      return res.status(404).json({ message: "No courses found." });
    }

    res.status(200).json(facultyCourses);
  } catch (error) {
    console.error("Error fetching faculty courses:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { facultyId, courseId } = req.params;

    const faculty = await userModule.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const hodCourse = await Course.findOne({
      type: "hod",
      instructor: req.user.id,
    });
    const code = hodCourse.code;
    if (code !== course.code) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course." });
    }

    await Course.deleteOne({ _id: courseId });
    res.status(200).json({ message: "Faculty deleted successfully." });
  } catch (error) {
    console.error("Error deleting faculty:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addFaculty = async (req, res) => {
  try {
    const { facultyEmail, courseId, section } = req.body;
    const hod = await userModule.findById(req.user.id);
    if (!hod || hod.role !== "hod") {
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (!course.instructor.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not the instructor of this course." });
    }

    const existingCourse = await Course.findOne({ name: course.name, section });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course already exists in this section." });
    }

    const faculty = await userModule.findOne({ email: facultyEmail });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }
    faculty.role = "faculty";
    await faculty.save();
    
    const newCourse = new Course({
      name: course.name, // Use the course name from the fetched course
      code: course.code, // Use the course code from the fetched course
      instructor: faculty._id, // Assign the new instructor
      section,
    });

    await newCourse.save();
    res
      .status(201)
      .json({
        message: "Faculty added to the course successfully.",
        course: newCourse,
      });
  } catch (error) {
    console.error("Error adding faculty:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { getUsers, getFaculty, getFacultyCourses, deleteFaculty, addFaculty, getHodCourse };
