import express from 'express';
import { getUserCourses, createUserCourse, updateUserCourse, removeUserCourse } from '../controllers/userCourseControllers.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

router.get('/user-course', validateUser(), getUserCourses);
router.post('/user-course', validateUser(), createUserCourse);
router.put('/user-course', validateUser(), updateUserCourse);
router.delete('/user-course', validateUser(), removeUserCourse);

export default router;