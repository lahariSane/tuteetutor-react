import express from "express";
import todosController from '../controllers/todosController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes
router.get("/todos",authMiddleware, todosController.getTodos); // Get all todos
router.post("/todos",authMiddleware,todosController.addTodo); // Add new todo
router.put("/todos/:id",authMiddleware,todosController.updateTodo); // Update a todo
router.delete("/todos/:id",authMiddleware,todosController.deleteTodo); // Delete a todo

// Use ES6 default export
export default router;
