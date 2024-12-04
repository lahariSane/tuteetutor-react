import express from 'express';
import { getCourse, createCourse, deleteCourse, getUserCourses, updateUserCourses, removeUserCourse, saveUserCourses } from '../controllers/courseControllers.js';

const router = express.Router();

router.get('/course', getCourse);
router.post('/course', createCourse);
router.get('/user-course/:userId', getUserCourses);
router.put('/user-course/:userId', updateUserCourses);
router.delete('/user-course/:userId', removeUserCourse);
router.delete('/course/:id', deleteCourse);
router.post('/user/:userId/courses', saveUserCourses);

router.get("/suggestions", (req, res) => {
  const query = req.query.q.toLowerCase(); 
  const filteredSuggestions = sampleData.filter((item) =>
    item.toLowerCase().includes(query)
  );
  res.json(filteredSuggestions);
});

export default router; 
