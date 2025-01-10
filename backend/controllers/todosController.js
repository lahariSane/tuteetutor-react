import Todo from "../models/todos.js";

// Get all todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};

// Add a new todo
const addTodo = async (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res
      .status(400)
      .json({ message: "Title and due date are required." });
  }

  try {
    const newTodo = new Todo({ title, dueDate, userId: req.user.id });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({
      message: "There is a problem adding the todo",
      error: error.message,
    });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, isCompleted } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      { _id: id, userId: req.user.id },
      { title, dueDate, isCompleted },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(400).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    res
      .status(400)
      .json({ message: "There is an error updating the todo", error });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deletedTodo) {
      res.status(400).json({ message: "The Todo is not found" });
    }
    res.json({ message: "Todo successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: "We couldn't delete the Todo", error });
  }
};

// Default exports
export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
