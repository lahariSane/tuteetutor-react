import express from 'express';
import ChangesController from '../controllers/changesController.js';

const router = express.Router();
const changesController = new ChangesController();

router.get('/', changesController.getChanges);
router.get('/:id', changesController.getChange);
router.post('/', changesController.createChange);
router.patch('/:id', changesController.updateChange);
router.delete('/:id', changesController.deleteChange);

export default router;