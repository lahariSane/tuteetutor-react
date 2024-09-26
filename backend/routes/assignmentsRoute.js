import express from 'express';
import AssignmentsController from '../controllers/assignmentControllers';

const router = express.Router();
const assignmentsController = new AssignmentsController();

router.get('/assignments', assignmentsController.getAssignments);
router.post('/assignments', assignmentsController.createAssignment);
router.patch('/assignments/:id', assignmentsController.updateAssignment);
router.delete('/assignments/:id', assignmentsController.deleteAssignment);