import express from 'express';
import multer from 'multer';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementsControllers.js';

const router = express.Router();


const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, "uploads/");
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + "-" + file.originalname);
    },
})

const upload = multer({storage: storage});

router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

export default router;