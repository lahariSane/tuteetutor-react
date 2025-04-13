import express from "express";
import ChangesController from "../controllers/changesController.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();
const changesController = new ChangesController();

/**
 * @swagger
 * tags:
 *   name: Changes
 *   description: API endpoints to create, view, update, and delete change records
 */

/**
 * @swagger
 * /changes:
 *   get:
 *     summary: Retrieve all changes
 *     tags: [Changes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of changes retrieved successfully
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
 *                     type: number
 *                   month:
 *                     type: number
 *                   year:
 *                     type: number
 *                   changeTo:
 *                     type: number
 *       500:
 *         description: Internal Server Error
 */
router.get("/", validateUser(), changesController.getChanges);

/**
 * @swagger
 * /changes/{id}:
 *   get:
 *     summary: Retrieve a single change by ID
 *     tags: [Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the change
 *     responses:
 *       200:
 *         description: Change retrieved successfully
 *       404:
 *         description: Change not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", validateUser(), changesController.getChange);

/**
 * @swagger
 * /changes:
 *   post:
 *     summary: Create a new change entry(Admin only)
 *     tags: [Changes]
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
 *                 type: number
 *                 example: 15
 *               month:
 *                 type: number
 *                 example: 8
 *               year:
 *                 type: number
 *                 example: 2024
 *               changeTo:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Change successfully created
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post("/", validateUser(['admin']), changesController.createChange);

/**
 * @swagger
 * /changes/{id}:
 *   patch:
 *     summary: Update a change by ID(Admin only)
 *     tags: [Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Change ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: number
 *                 example: 16
 *               month:
 *                 type: number
 *                 example: 9
 *               year:
 *                 type: number
 *                 example: 2024
 *               changeTo:
 *                 type: number
 *                 example: 150
 *     responses:
 *       200:
 *         description: Change successfully updated
 *       404:
 *         description: Change not found
 *       500:
 *         description: Internal Server Error
 */
router.patch("/:id", validateUser(['admin']), changesController.updateChange);

/**
 * @swagger
 * /changes/{id}:
 *   delete:
 *     summary: Delete a change by ID(Admin only)
 *     tags: [Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Change ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Change successfully deleted
 *       404:
 *         description: Change not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", validateUser(['admin']), changesController.deleteChange);

export default router;
