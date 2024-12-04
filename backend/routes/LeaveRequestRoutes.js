import express from 'express';
import { leaveRequestSubmit, leaveRequestGetAll, leaveRequestDelete } from '../controllers/leaveRequestControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 



const router = express.Router();

// Handle form submission
router.post('/submit', authMiddleware,leaveRequestSubmit);

router.get('/all', authMiddleware,leaveRequestGetAll);

router.delete('/:id',authMiddleware, leaveRequestDelete);

// Export the router
export default router;

