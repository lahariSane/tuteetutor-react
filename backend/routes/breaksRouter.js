import express from 'express';
import BreaksController from '../controllers/breaksController';

const router = express.Router();
const breaksController = new BreaksController();

router.get('/breaks', breaksController.getBreaks);
router.post('/breaks', breaksController.createBreak);
router.patch('/breaks/:id', breaksController.updateBreak);
router.delete('/breaks/:id', breaksController.deleteBreak);