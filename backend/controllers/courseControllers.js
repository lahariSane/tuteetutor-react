import Course from "../models/userCourseModel.js";
import courseModel from "../models/courseModel.js";

const getCourse = async (req, res) => {
  try {
    const sections = await courseModel.find({ type: { $ne: "hod" } });
    const courses = await courseModel.find({ type: "hod" });
    const groupedSections = sections.reduce((acc, { _id, name, section }) => {
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push({ _id, name, section });
      return acc;
    }, {});

    // Step 2: Create the final courses array with sections
    const result = courses.map((course) => ({
      _id: course._id,
      name: course.name,
      sections: groupedSections[course.name] || [], // If no sections match, return an empty array
    }));
    const course = await courseModel.find({ type: "hod" });

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const createCourse = async (req, res) => {
  const course = req.body;
  const newCourse = new courseModel(course);
  try {
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
<<<<<<< HEAD
} 
=======
};
>>>>>>> 361b5140a84bb357fb492dbc73d09ca9ca291b4d

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    await courseModel.findByIdAndRemove(id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get course and section details for a user
export const getUserCourses = async (req, res) => {
  const { userId } = req.params;
  try {
    const userCourses = await Course.findOne({ user: userId }).populate(
      "courseRegistered"
    );
    res.status(200).json(userCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update course and section for a user
export const updateUserCourses = async (req, res) => {
  const { userId } = req.params;
  const { courseId, section } = req.body;

  try {
    let userCourses = await Course.findOne({ user: userId });

    if (!userCourses) {
      userCourses = new Course({
        user: userId,
        courseRegistered: [courseId],
      });
    } else {
      if (!userCourses.courseRegistered.includes(courseId)) {
        userCourses.courseRegistered.push(courseId);
      }
    }

    await userCourses.save();

    const populatedUserCourses = await Course.findOne({
      user: userId,
    }).populate("courseRegistered");

    res.status(200).json(populatedUserCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeUserCourse = async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.body;

  try {
    const userCourses = await Course.findOne({ user: userId });

    if (!userCourses) {
      return res.status(404).json({ message: "User courses not found" });
    }

    userCourses.courseRegistered = userCourses.courseRegistered.filter(
      (course) => course.toString() !== courseId
    );

    await userCourses.save();

    const populatedUserCourses = await Course.findOne({
      user: userId,
    }).populate("courseRegistered");

    res.status(200).json(populatedUserCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveUserCourses = async (req, res) => {
  const { userId } = req.params;
  const { courses } = req.body;

  try {
    let userCourses = await Course.findOne({ user: userId });

    if (!userCourses) {
      userCourses = new Course({ user: userId, courseRegistered: [] });
    }

    // For each selected course, save the course and section
    for (const { courseId, section } of courses) {
      userCourses.courseRegistered.push(section);
    }

    await userCourses.save();

    res.status(200).json(userCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getCourse, createCourse, deleteCourse };
