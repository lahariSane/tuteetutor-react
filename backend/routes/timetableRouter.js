import express from 'express';
import { getTimetable, createTimetable, deleteTimetable } from '../controllers/timetableControllers.js';

const router = express.Router();

router.get('/timetable', getTimetable);
router.post('/timetable', createTimetable);
router.delete('/timetable/:id', deleteTimetable);

export default router;