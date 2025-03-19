import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import validateUser from '../middlewares/validateUser.js';
import { 
  getAnnouncements, 
  createAnnouncement, 
  deleteAnnouncement, 
  updateAnnouncement,
  getFacultyCourses 
} from '../controllers/announcementsControllers.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, `announcement-${uniqueSuffix}.${fileExtension}`);
    },
});

// Define file filter for security
const fileFilter = (req, file, cb) => {
    // Accept common document and media types
    const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
    ];

    // Accept all file types in development mode for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment || allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only documents, images, and common office files are allowed.'), false);
    }
};

// Set file size limits
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

// Debug middleware
router.use('/announcements', (req, res, next) => {
  console.log('Announcement request received:', {
    method: req.method,
    path: req.originalUrl,
    body: req.method === 'GET' ? '[GET request]' : req.body,
    user: req.user ? `${req.user.id} (${req.user.role})` : 'No user in request'
  });
  next();
});

// Routes
router.get('/announcements', validateUser(), getAnnouncements);
router.post('/announcements', validateUser(['hod', 'faculty', 'admin']), upload.single('file'), createAnnouncement);
router.delete('/announcements/:id', validateUser(['hod', 'faculty', 'admin']), deleteAnnouncement);
router.put('/announcements/:id', validateUser(['hod', 'faculty', 'admin']), upload.single('file'), updateAnnouncement);

// New route for getting courses for faculty announcements
router.get('/announcements/faculty', validateUser(['hod', 'faculty', 'admin']), getFacultyCourses);

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Error handling middleware for multer errors
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        console.error('Other error in router:', err);
        return res.status(400).json({ message: err.message });
    }
    next();
});

export default router;