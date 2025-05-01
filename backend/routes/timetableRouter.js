import express from 'express';
import { 
  getTimetable, 
  createTimetable, 
  updateTimetable, 
  deleteTimetable, 
  getAllTimetables 
} from '../controllers/timetableControllers.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: API endpoints for managing timetables
 */

/**
 * @swagger
 * /timetable:
 *   get:
 *     summary: Get the timetable for the current user
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the timetable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timetables:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       day:
 *                         type: string
 *                         example: "Friday"
 *                       startTime:
 *                         type: string
 *                         example: "08:45"
 *                       endTime:
 *                         type: string
 *                         example: "09:45"
 *                       subject:
 *                         type: string
 *                         example: "Mathematics"
 *                       section:
 *                         type: string
 *                         example: "A"
 *                       roomNo:
 *                         type: string
 *                         example: "G-01"
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Internal Server Error
 */
router.get('/timetable', validateUser(), getTimetable);

/**
 * @swagger
 * /timetables:
 *   get:
 *     summary: Get all timetables (Admin only)
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of all timetables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   day:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   time:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/timetables', validateUser(['admin']), getAllTimetables);

/**
 * @swagger
 * /timetable:
 *   post:
 *     summary: Create a new timetable entry (Admin only)
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60b6c8b2d3b8d3e54f6d0b9d"
 *               day:
 *                 type: string
 *                 example: "Monday"
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *               time:
 *                 type: string
 *                 example: "10:00 AM - 11:00 AM"
 *     responses:
 *       201:
 *         description: Timetable entry successfully created
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/timetable', validateUser(['admin']), createTimetable);

/**
 * @swagger
 * /timetable/{id}:
 *   delete:
 *     summary: Delete a timetable entry by ID (Admin only)
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ID
 *     responses:
 *       200:
 *         description: Timetable entry successfully deleted
 *       404:
 *         description: Timetable not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/timetable/:id', validateUser(['admin']), deleteTimetable);

/**
 * @swagger
 * /timetable/{id}:
 *   patch:
 *     summary: Update a timetable entry by ID (Admin only)
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 example: "Monday"
 *               subject:
 *                 type: string
 *                 example: "Physics"
 *               time:
 *                 type: string
 *                 example: "11:00 AM - 12:00 PM"
 *     responses:
 *       200:
 *         description: Timetable entry successfully updated
 *       404:
 *         description: Timetable not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/timetable/:id', validateUser(['admin']), updateTimetable);

export default router;
