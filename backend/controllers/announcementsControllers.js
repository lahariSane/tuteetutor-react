import Announcements from "../models/announcementModel.js";
import User from "../models/userModule.js";
import Course from "../models/courseModel.js";
import userCourseSchema from "../models/userCourseModel.js";
import mongoose from "mongoose";

const getAnnouncements = async (req, res) => {
  try {
    console.log("Getting announcements for user:", req.user);
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
      const userCourse = await userCourseSchema
        .findOne({ user: userId })
        .populate("courseRegistered");
      
      if (!userCourse) {
        return res
          .status(404)
          .json({ message: "No courses found for the user." });
      }
      
      courses = userCourse.courseRegistered;
    }

    console.log("Found courses:", courses);

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

    console.log(`Found ${announcements.length} announcements`);
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error getting announcements:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    console.log("Create announcement request:", req.body);
    console.log("File received:", req.file);
    console.log("User from token:", req.user);
    
    // Extract data from request
    const { courseId, title, description, authorId } = req.body;
    const file = req.file ? req.file.path : null; // Get the uploaded file path if exists
    
    // Use either authorId from the body or user.id from the token
    const userId = authorId || (req.user ? req.user.id : null);
    
    console.log("Using userId for lookup:", userId);
    
    if (!userId) {
      return res.status(400).json({ 
        message: "No user ID provided. Please ensure you're logged in or provide authorId.",
        debug: { body: req.body, user: req.user }
      });
    }
    
    // Find the user
    const user = await User.findById(userId);
    console.log("Found user:", user ? `${user.name} (${user._id})` : "null");
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        userId: userId,
        debug: { body: req.body, user: req.user }
      });
    }

    // Check if courseId is provided
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    
    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    console.log("Found course:", course ? `${course.name} (${course._id})` : "null");
    
    if (!course) {
      return res.status(404).json({ message: "Course not found", courseId });
    }

    // Check if description is provided
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Permission checks
    let hasPermission = false;
    
    if (user.role === "admin") {
      hasPermission = true; // Admin can create announcements for any course
    } else if (user.role === "faculty") {
      // Faculty can only create announcements for courses they teach
      hasPermission = course.instructor && course.instructor.toString() === user._id.toString();
    } else if (user.role === "hod") {
      // HOD can create announcements for their own courses or courses in their department
      if (course.instructor && course.instructor.toString() === user._id.toString()) {
        hasPermission = true;
      } else {
        const hodCourses = await Course.find({ instructor: user._id, type: "hod" });
        const courseCodeMatches = hodCourses.some(
          (hodCourse) => hodCourse.code === course.code
        );
        hasPermission = courseCodeMatches;
      }
    }
    
    console.log("User permission check:", {
      role: user.role,
      hasPermission: hasPermission
    });

    if (!hasPermission) {
      return res.status(403).json({
        message: "You don't have permission to create announcements for this course",
        userRole: user.role
      });
    }

    // Create a new announcement with file if provided
    const announcementTitle = title || `${course.name} - ${course.section}`;
    const newAnnouncement = new Announcements({
      title: announcementTitle,
      description: description,
      authorId: user._id,
      author: user.name,
      course: course._id,
      file: file, // Add the file path if a file was uploaded
      date: new Date()
    });

    console.log("Creating new announcement:", newAnnouncement);
    
    await newAnnouncement.save();
    console.log("Announcement saved successfully");
    
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid announcement ID format" });
    }
    
    const announcement = await Announcements.findById(id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    // Check permissions (optional)
    // Only the author, HOD, or admin can delete the announcement
    if (req.user.role !== 'admin' && 
        announcement.authorId.toString() !== req.user.id.toString() &&
        req.user.role !== 'hod') {
      return res.status(403).json({ message: "You don't have permission to delete this announcement" });
    }
    
    // Delete the file if it exists (requires fs module)
    // if (announcement.file) {
    //   try {
    //     await fs.unlink(announcement.file);
    //   } catch (fileError) {
    //     console.error("Error deleting file:", fileError);
    //   }
    // }
    
    await Announcements.findByIdAndRemove(id);
    
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid announcement ID format" });
    }
    
    // Find the announcement first
    const announcement = await Announcements.findById(id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    // Check permissions (optional)
    // Only the author, HOD, or admin can update the announcement
    if (req.user.role !== 'admin' && 
        announcement.authorId.toString() !== req.user.id.toString() &&
        req.user.role !== 'hod') {
      return res.status(403).json({ message: "You don't have permission to update this announcement" });
    }
    
    // If there's a new file, update the file path
    if (req.file) {
      updatedData.file = req.file.path;
      
      // Delete old file if it exists (requires fs module)
      // if (announcement.file) {
      //   try {
      //     await fs.unlink(announcement.file);
      //   } catch (fileError) {
      //     console.error("Error deleting old file:", fileError);
      //   }
      // }
    }
    
    const updatedAnnouncement = await Announcements.findByIdAndUpdate(id, updatedData, { new: true });
    
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get faculties for announcement dropdown
const getFacultyCourses = async (req, res) => {
  try {
    console.log("Getting faculty courses for user:", req.user);
    const userId = req.user.id;
    
    let courses;
    
    if (req.user.role === "faculty") {
      courses = await Course.find({ instructor: userId });
    } else if (req.user.role === "hod") {
      // First, get the HOD courses
      const hodCourses = await Course.find({ instructor: userId, type: "hod" });
      
      if (hodCourses.length > 0) {
        // Get all department courses that match the HOD's department codes
        const departmentCodes = hodCourses.map(course => course.code);
        
        courses = await Course.find({
          $or: [
            { code: { $in: departmentCodes }, type: { $ne: "hod" } },
            { instructor: userId }
          ]
        });
      } else {
        courses = await Course.find({ instructor: userId });
      }
    } else if (req.user.role === "admin") {
      courses = await Course.find();
    } else {
      return res.status(403).json({ message: "Only faculty, HOD, or admin can access this endpoint" });
    }
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    
    console.log(`Found ${courses.length} courses for faculty ${userId}`);
    
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error getting faculty courses:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export { 
  getAnnouncements, 
  createAnnouncement, 
  deleteAnnouncement, 
  updateAnnouncement,
  getFacultyCourses
};