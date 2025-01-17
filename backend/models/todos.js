import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
