import express from 'express';
import { getHolidays, createHoliday, deleteHoliday } from '../controllers/holidaysControllers.js';

const router = express.Router();

router.get('/holidays', getHolidays);
router.post('/holidays', createHoliday);
router.delete('/holiday/:id', deleteHoliday);

export default router;