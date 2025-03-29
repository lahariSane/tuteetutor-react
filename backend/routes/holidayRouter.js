import express from 'express';
import { 
  getHolidays, 
  createHoliday, 
  updateHoliday, 
  deleteHoliday 
} from '../controllers/holidaysControllers.js';

const router = express.Router();

router.get('/holidays', getHolidays);
router.post('/holidays', createHoliday);
router.patch('/holiday/:id', updateHoliday);
router.delete('/holiday/:id', deleteHoliday);

export default router;
