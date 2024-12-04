import express from 'express';
import multer from 'multer';
import validateUser from '../middlewares/validateUser.js';
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

router.get('/announcements', validateUser(), getAnnouncements);
router.post('/announcements', validateUser(['hod', 'faculty']), createAnnouncement);
router.delete('/announcements/:id', validateUser(['hod', 'faculty']), deleteAnnouncement);

export default router;