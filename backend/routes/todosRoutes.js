import express from "express";
import todosController from '../controllers/todosController.js';

const router = express.Router();

// Routes
router.get("/todos", todosController.getTodos); // Get all todos
router.post("/todos", todosController.addTodo); // Add new todo
router.put("/todos/:id", todosController.updateTodo); // Update a todo
router.delete("/todos/:id", todosController.deleteTodo); // Delete a todo

// Use ES6 default export
export default router;
