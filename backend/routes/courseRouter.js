import express from 'express';
import { getCourse, createCourse, deleteCourse, getUserCourses, updateUserCourses, removeUserCourse } from '../controllers/courseControllers.js';
import e from 'express';

const router = express.Router();

router.get('/course', getCourse);
router.post('/course', createCourse);
router.get('/user-course/:userId', getUserCourses);
router.put('/user-course/:userId', updateUserCourses);
router.delete('/user-course/:userId', removeUserCourse);
router.delete('/course/:id', deleteCourse);
const sampleData = ["React", "Redux", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript"];

router.get("/suggestions", (req, res) => {
  const query = req.query.q.toLowerCase();
  const filteredSuggestions = sampleData.filter((item) =>
    item.toLowerCase().includes(query)
  );
  res.json(filteredSuggestions);
});

export default router; 