import express from "express";
import BreaksController from "../controllers/breaksController.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();
const breaksController = new BreaksController();

/**
 * @swagger
 * tags:
 *   name: Breaks
 *   description: Endpoints for managing break timings
 */

/**
 * @swagger
 * /break/breaks:
 *   get:
 *     summary: Retrieve all breaks
 *     tags: [Breaks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of breaks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get("/breaks", validateUser(), breaksController.getBreaks);

/**
 * @swagger
 * /break/addBreak:
 *   post:
 *     summary: Add a new break (Admin only)
 *     tags: [Breaks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *               - description
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "10:00 AM"
 *               endTime:
 *                 type: string
 *                 example: "10:30 AM"
 *               description:
 *                 type: string
 *                 example: "Morning coffee break"
 *     responses:
 *       201:
 *         description: Break successfully added
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post("/addBreak", validateUser(['admin']), breaksController.createBreak);

/**
 * @swagger
 * /break/breaks/{id}:
 *   patch:
 *     summary: Update a break by ID (Admin only)
 *     tags: [Breaks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Break ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "11:00 AM"
 *               endTime:
 *                 type: string
 *                 example: "11:15 AM"
 *               description:
 *                 type: string
 *                 example: "Updated break details"
 *     responses:
 *       200:
 *         description: Break successfully updated
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Break not found
 *       500:
 *         description: Internal server error
 */
router.patch("/breaks/:id", validateUser(['admin']), breaksController.updateBreak);

/**
 * @swagger
 * /break/breaks/{id}:
 *   delete:
 *     summary: Delete a break by ID (Admin only)
 *     tags: [Breaks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Break ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Break successfully deleted
 *       400:
 *         description: Invalid break ID
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Break not found
 *       500:
 *         description: Internal server error
 */
router.delete("/breaks/:id", validateUser(['admin']), breaksController.deleteBreak);

export default router;
