import solrService from "../services/solrService.js";
import userCourseSchema from "../models/userCourseModel.js";
import Course from "../models/courseModel.js";

export const searchController = {
  // Search announcements
  async searchAnnouncements(req, res) {
    try {
      const { q, page = 1, limit = 10, courseId, dateRange } = req.query;
      const { id: userId, role } = req.user;

      // Get user's courses first to filter results
      let courseIds = [];

      if (role === "faculty") {
        const courses = await Course.find({ instructor: userId });
        courseIds = courses.map((course) => course._id.toString());
      } else if (role === "hod") {
        // Similar logic as in getAnnouncements
        // ... (implement HOD course filtering)
      } else {
        const userCourse = await userCourseSchema
          .findOne({ user: userId })
          .populate("courseRegistered");

        if (userCourse && userCourse.courseRegistered) {
          courseIds = userCourse.courseRegistered.map((course) =>
            course._id.toString(),
          );
        }
      }

      // Build filters
      const filters = {
        start: (page - 1) * limit,
        rows: limit,
      };

      if (courseId) {
        filters.courseId = courseId;
      } else if (courseIds.length > 0) {
        // Filter by user's courses
        filters.courseId = `(${courseIds.join(" OR ")})`;
      }

      if (dateRange) {
        filters.dateRange = dateRange;
      }

      const results = await solrService.searchAnnouncements(q, filters);

      res.json({
        success: true,
        data: results.docs,
        total: results.numFound,
        highlighting: results.highlighting,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error("Search announcements error:", error);
      res.status(500).json({
        success: false,
        message: "Error searching announcements",
        error: error.message,
      });
    }
  },

  // Search todos
  async searchTodos(req, res) {
    try {
      // Debug log to see what's in req.user
      console.log("Full req.user object:", req.user);
      console.log("Trying to access req.user.id:", req.user.id);
      console.log("Trying to access req.user._id:", req.user._id);

      const { q, page = 1, limit = 10, isCompleted, dueDate } = req.query;

      // Try to get userId from either id or _id
      const userId = req.user.id || req.user._id;

      if (!userId) {
        console.error("User ID not found. req.user contains:", req.user);
        throw new Error("User ID not found in request");
      }

      const filters = {
        start: (page - 1) * limit,
        rows: limit,
      };
      console.log("Using userId:", userId, q, userId, filters);

      if (isCompleted !== undefined) {
        filters.isCompleted = isCompleted === "true";
      }

      if (dueDate) {
        filters.dueDate = dueDate;
      }

      const results = await solrService.searchTodos(q, userId, filters);

      res.json({
        success: true,
        data: results.docs,
        total: results.numFound,
        highlighting: results.highlighting,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error("Search todos error:", error);
      res.status(500).json({
        success: false,
        message: "Error searching todos",
        error: error.message,
      });
    }
  },

  // Global search across both announcements and todos
  async globalSearch(req, res) {
    try {
      const { q } = req.query;
      const userId = req.user.id;

      // Search both announcements and todos
      const [announcements, todos] = await Promise.all([
        solrService.searchAnnouncements(q, { rows: 5 }),
        solrService.searchTodos(q, userId, { rows: 5 }),
      ]);

      res.json({
        success: true,
        data: {
          announcements: announcements.docs,
          todos: todos.docs,
        },
      });
    } catch (error) {
      console.error("Global search error:", error);
      res.status(500).json({
        success: false,
        message: "Error performing global search",
        error: error.message,
      });
    }
  },
};
