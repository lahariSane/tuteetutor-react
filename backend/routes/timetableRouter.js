import express from 'express';
import { getTimetable, createTimetable, deleteTimetable } from '../controllers/timetableControllers.js';
import validateUser from '../middlewares/validateUser.js';
const router = express.Router();

router.get('/timetable', validateUser(), getTimetable);
router.post('/timetable', createTimetable);
router.delete('/timetable/:id', deleteTimetable);

export default router;