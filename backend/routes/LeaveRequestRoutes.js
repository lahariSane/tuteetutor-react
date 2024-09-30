import express from 'express';
import { leaveRequestSubmit, leaveRequestGetAll, leaveRequestDelete } from '../controllers/leaveRequestControllers.js';

const router = express.Router();

// Handle form submission
router.post('/submit', leaveRequestSubmit);

router.get('/all', leaveRequestGetAll);

router.delete('/:id', leaveRequestDelete);

// Export the router
export default router;

