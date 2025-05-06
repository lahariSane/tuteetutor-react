import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import validateUser from "../middlewares/validateUser.js";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  getFacultyCourses,
} from "../controllers/announcementsControllers.js";
import cacheMiddleware, {
  invalidateCache,
} from "../middlewares/cacheMiddleware.js";

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `announcement-${uniqueSuffix}.${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ];

  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment || allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only documents, images, and common office files are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Debug middleware
router.use("/announcements", (req, res, next) => {
  console.log("Announcement request received:", {
    method: req.method,
    path: req.originalUrl,
    body: req.method === "GET" ? "[GET request]" : req.body,
    user: req.user ? `${req.user.id} (${req.user.role})` : "No user in request",
  });
  next();
});

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Announcement type (optional)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of announcements
 */
router.get(
  "/announcements",
  validateUser(),
  cacheMiddleware({
    expiration: 300,
    keyPrefix: "announcements",
    generateKey: (req) => {
      const role = req.user?.role || "guest";
      const page = req.query.page || "1";
      const limit = req.query.limit || "10";
      const type = req.query.type || "all";
      return `${role}:${type}:page${page}:limit${limit}`;
    },
  }),
  getAnnouncements,
);

/**
 * @swagger
 * /announcements/faculty:
 *   get:
 *     summary: Get faculty courses
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses taught by faculty
 */
router.get(
  "/announcements/faculty",
  validateUser(["hod", "faculty", "admin"]),
  cacheMiddleware({
    expiration: 900,
    keyPrefix: "faculty-courses",
    generateKey: (req) => req.user?.id || "anonymous",
  }),
  getFacultyCourses,
);

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               courseId:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Announcement created
 */
router.post(
  "/announcements",
  validateUser(["hod", "faculty", "admin"]),
  upload.single("file"),
  async (req, res, next) => {
    try {
      await createAnnouncement(req, res);
      await invalidateCache("announcements:*");
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement deleted
 */
router.delete(
  "/announcements/:id",
  validateUser(["hod", "faculty", "admin"]),
  async (req, res, next) => {
    try {
      await deleteAnnouncement(req, res);
      await invalidateCache("announcements:*");
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /announcements/{id}:
 *   put:
 *     summary: Update an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Announcement updated
 */
router.put(
  "/announcements/:id",
  validateUser(["hod", "faculty", "admin"]),
  upload.single("file"),
  async (req, res, next) => {
    try {
      await updateAnnouncement(req, res);
      await invalidateCache("announcements:*");
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /uploads/{filename}:
 *   get:
 *     summary: Serve uploaded announcement files
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the uploaded file
 *     responses:
 *       200:
 *         description: Returns the requested file
 */
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    console.error("Other error in router:", err);
    return res.status(400).json({ message: err.message });
  }
  next();
});

export default router;
