import express from "express";
import todosController from "../controllers/todosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management APIs
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for a user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 *       500:
 *         description: Server error
 */
router.get("/todos", authMiddleware, todosController.getTodos);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Add a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Missing title or due date / Validation error
 */
router.post("/todos", authMiddleware, todosController.addTodo);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated todo
 *       400:
 *         description: Todo not found or update error
 */
router.put("/todos/:id", authMiddleware, todosController.updateTodo);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to delete
 *     responses:
 *       200:
 *         description: Todo successfully deleted
 *       400:
 *         description: Todo not found or delete error
 */
router.delete("/todos/:id", authMiddleware, todosController.deleteTodo);

export default router;
