import mongoose from "mongoose";
import { syncTodoToSolr, removeFromSolr } from "../middlewares/solrSync.js";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Solr sync hooks
todoSchema.post("save", function (doc) {
  syncTodoToSolr(doc);
});

todoSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    syncTodoToSolr(doc);
  }
});

todoSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    removeFromSolr(doc._id.toString(), "todos");
  }
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
