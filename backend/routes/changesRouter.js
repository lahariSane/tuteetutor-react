import express from "express";
import ChangesController from "../controllers/changesController.js";

const router = express.Router();
const changesController = new ChangesController();

/**
 * @swagger
 * tags:
 *   name: Changes
 *   description: API for managing changes
 */

/**
 * @swagger
 * /changes:
 *   get:
 *     summary: Get all changes
 *     tags: [Changes]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of changes
 *       500:
 *         description: Internal Server Error
 */
router.get("/", changesController.getChanges);

/**
 * @swagger
 * /changes/{id}:
 *   get:
 *     summary: Get a specific change by ID
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Change ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Successfully retrieved the change
 *       404:
 *         description: Change not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", changesController.getChange);

/**
 * @swagger
 * /changes:
 *   post:
 *     summary: Create a new change
 *     tags: [Changes]
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
router.post("/", changesController.createChange);

/**
 * @swagger
 * /changes/{id}:
 *   patch:
 *     summary: Update a change by ID
 *     tags: [Changes]
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
router.patch("/:id", changesController.updateChange);

/**
 * @swagger
 * /changes/{id}:
 *   delete:
 *     summary: Delete a change by ID
 *     tags: [Changes]
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
router.delete("/:id", changesController.deleteChange);

export default router;
