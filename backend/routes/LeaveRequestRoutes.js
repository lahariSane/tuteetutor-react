import express from "express";
import {
  leaveRequestSubmit,
  leaveRequestGetAll,
  leaveRequestDelete,
} from "../controllers/leaveRequestControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Handle form submission
/**
 * @swagger
 * tags:
 *   name: Leave Requests
 *   description: API endpoints for managing leave requests
 */
router.post("/submit", authMiddleware, leaveRequestSubmit);
/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Submit a leave request
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *               studentID:
 *                 type: string
 *               fromDate:
 *                 type: string
 *                 format: date
 *               toDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request submitted successfully
 *       500:
 *         description: Error submitting leave request
 */

router.get("/all", authMiddleware, leaveRequestGetAll);
/**
 * @swagger
 * /all:
 *   get:
 *     summary: Retrieve all leave requests
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 *       500:
 *         description: Error retrieving leave requests
 */

router.delete("/:id", authMiddleware, leaveRequestDelete);
/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a leave request
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The leave request ID
 *     responses:
 *       200:
 *         description: Leave request deleted successfully
 *       500:
 *         description: Error deleting leave request
 */

// Export the router
export default router;
