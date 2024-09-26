import express from 'express';
import { getUserCourses, createUserCourse, updateUserCourse, removeUserCourse } from '../controllers/userCourseControllers.js';

const router = express.Router();

router.get('/user-course', getUserCourses);
router.post('/user-course', createUserCourse);
router.put('/user-course/:id', updateUserCourse);
router.delete('/user-course/:id', removeUserCourse);

export default router;