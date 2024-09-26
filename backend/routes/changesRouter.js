import express from 'express';
import ChangesController from '../controllers/changesController';

const router = express.Router();
const changesController = new ChangesController();

router.get('/', changesController.getChanges);
router.post('/', changesController.createChange);
router.patch('/:id', changesController.updateChange);