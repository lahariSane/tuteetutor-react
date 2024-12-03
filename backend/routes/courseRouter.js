import express from 'express';
import { getCourse, createCourse, deleteCourse } from '../controllers/courseControllers.js';

const router = express.Router();

router.get('/course', getCourse);
router.post('/course', createCourse);
router.delete('/course/:id', deleteCourse);

export default router;