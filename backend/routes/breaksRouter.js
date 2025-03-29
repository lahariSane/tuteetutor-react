import express from "express";
import BreaksController from "../controllers/breaksController.js";

const router = express.Router();
const breaksController = new BreaksController();

/**
 * @swagger
 * tags:
 *   name: Breaks
 *   description: API for managing breaks
 */

/**
 * @swagger
 * /break/breaks:
 *   get:
 *     summary: Get all breaks
 *     tags: [Breaks]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of breaks
 *       500:
 *         description: Server error
 */
router.get("/breaks", breaksController.getBreaks);

/**
 * @swagger
 * /break/addBreak:
 *   post:
 *     summary: Add a new break
 *     tags: [Breaks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 */
router.post("/addBreak", breaksController.createBreak);

/**
 * @swagger
 * /break/breaks/{id}:
 *   patch:
 *     summary: Update a break
 *     tags: [Breaks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Break ID
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
 *         description: Invalid break ID
 *       404:
 *         description: Break not found
 *       500:
 *         description: Server error
 */
router.patch("/breaks/:id", breaksController.updateBreak);

/**
 * @swagger
 * /break/breaks/{id}:
 *   delete:
 *     summary: Delete a break
 *     tags: [Breaks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Break ID
 *     responses:
 *       200:
 *         description: Break successfully deleted
 *       400:
 *         description: Invalid break ID
 *       404:
 *         description: Break not found
 *       500:
 *         description: Server error
 */
router.delete("/breaks/:id", breaksController.deleteBreak);

export default router;
