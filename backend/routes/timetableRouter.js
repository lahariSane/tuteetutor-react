import express from 'express';
import { getTimetable, createTimetable, updateTimetable, deleteTimetable, getAllTimetables } from '../controllers/timetableControllers.js';
import validateUser from '../middlewares/validateUser.js';
const router = express.Router();

router.get('/timetable', validateUser(), getTimetable);
router.get('/timetables', getAllTimetables);
router.post('/timetable', createTimetable);
router.delete('/timetable/:id', deleteTimetable);
router.patch('/timetable/:id', updateTimetable);

export default router;