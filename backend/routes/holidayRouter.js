import express from 'express';
import { 
  getHolidays, 
  createHoliday, 
  updateHoliday, 
  deleteHoliday 
} from '../controllers/holidaysControllers.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Holidays
 *   description: API endpoints for managing holidays
 */

/**
 * @swagger
 * /holidays:
 *   get:
 *     summary: Get a list of all holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of holidays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     example: "2024-12-25"
 *                   name:
 *                     type: string
 *                     example: "Christmas Day"
 *       500:
 *         description: Internal Server Error
 */
router.get('/holidays', validateUser(), getHolidays);

/**
 * @swagger
 * /holidays:
 *   post:
 *     summary: Create a new holiday(Admin only)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2024-12-25"
 *               name:
 *                 type: string
 *                 example: "Christmas Day"
 *     responses:
 *       201:
 *         description: Holiday successfully created
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/holidays', validateUser(['admin']), createHoliday);

/**
 * @swagger
 * /holiday/{id}:
 *   patch:
 *     summary: Update an existing holiday(Admin only)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2024-12-25"
 *               name:
 *                 type: string
 *                 example: "Christmas Day"
 *     responses:
 *       200:
 *         description: Holiday successfully updated
 *       404:
 *         description: Holiday not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/holiday/:id', validateUser(['admin']), updateHoliday);

/**
 * @swagger
 * /holiday/{id}:
 *   delete:
 *     summary: Delete a holiday by ID(Admin only)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID
 *     responses:
 *       200:
 *         description: Holiday successfully deleted
 *       404:
 *         description: Holiday not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/holiday/:id', validateUser(['admin']), deleteHoliday);

export default router;
