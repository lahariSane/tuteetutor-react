import React, { useState, useEffect } from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function TodoList() {
  // State to manage todo items, initially an empty array
  const [todos, setTodos] = useState([]);

  // State to control the form visibility
  const [showForm, setShowForm] = useState(false);

  // State to manage form input values for adding a new to-do
  const [newTodo, setNewTodo] = useState({ title: "", dueDate: "" });

  // State to track which todo is being edited
  const [editIndex, setEditIndex] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: "", dueDate: "" });
  const [error, setError] = useState("");

  // Fetch todos from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // Function to validate date input
  const validateDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    return selectedDate >= currentDate; // Ensure the selected date is today or in the future
  };

  // Handle form submission to add a new to-do item
  const handleAddTodo = (e) => {
    e.preventDefault(); // Prevent form reload

    if (!validateDate(newTodo.dueDate)) {
      setError("Deadline cannot be in the past.");
      return;
    }

    if (newTodo.title && newTodo.dueDate) {
      fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo), // Send the newTodo object to the backend
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos([...todos, data]); // Add new todo to local state
          setNewTodo({ title: "", dueDate: "" }); // Reset input fields
          setShowForm(false); // Close form after adding
          setError(""); // Clear any errors
        })
        .catch((error) => console.error("Error adding todo:", error));
    }
  };

  // Handle delete to-do
  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  // Handle marking a to-do as completed
  const handleTodoDoneIcon = (id) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    const updatedTodo = {
      ...todoToUpdate,
      isCompleted: !todoToUpdate.isCompleted,
    };

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((updated) => {
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? updated : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  // Handle edit button click
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditTodo({
      title: todos[index].title,
      dueDate: todos[index].dueDate,
    });
  };

  // Handle save of the edited todo
  const handleSaveEdit = (e, id) => {
    e.preventDefault();

    if (!validateDate(editTodo.dueDate)) {
      setError("Edited deadline cannot be in the past.");
      return;
    }

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTodo),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
        setEditIndex(null); // Exit edit mode
        setError(""); // Clear any errors
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  return (
    <div>
      <div className="flex flex-row px-5 mx-5 my-5 bg-gray-100 rounded-lg py-5 justify-between items-center">
        <PendingActionsIcon className="hover:text-green-500 transition-transform duration-200" />
        <AddIcon
          className="hover:text-purple-500 hover:scale-125 transition-transform duration-200 cursor-pointer"
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
        />
        <MoreVertIcon className="hover:text-red-500 hover:translate-y-1 transition-transform duration-200" />
      </div>

      {/* Form to add a new to-do */}
      {showForm && (
        <div className="mx-5 my-5 p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add a New To-Do
          </h2>
          <form onSubmit={handleAddTodo}>
            <div className="flex flex-col space-y-6">
              <input
                type="text"
                placeholder="Enter To-Do Title"
                className="p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTodo.dueDate}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, dueDate: e.target.value })
                }
                required
              />
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="p-4 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition-all duration-200 ease-in-out"
              >
                Add To-Do
              </button>
            </div>
          </form>
        </div>
      )}

      {/* To-do List */}
      <div className="space-y-5 mx-5 my-5">
        <ul className="flex-column space-y-4 text-sm font-medium text-gray-500">
          {todos.map((todo, index) => (
            <li key={todo._id}>
              <div className="inline-flex items-center justify-between px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 font-bold w-full">
                <div className="flex flex-row items-center space-x-5">
                  <i
                    className={`fa-${
                      todo.isCompleted
                        ? "solid fa-circle-check"
                        : "regular fa-circle"
                    } cursor-pointer`}
                    onClick={() => handleTodoDoneIcon(todo._id)} // Toggle complete status
                  ></i>

                  {/* Edit Mode */}
                  {editIndex === index ? (
                    <form onSubmit={(e) => handleSaveEdit(e, todo._id)}>
                      <input
                        type="text"
                        value={editTodo.title}
                        onChange={(e) =>
                          setEditTodo({ ...editTodo, title: e.target.value })
                        }
                        className="p-2 border border-gray-300 rounded-lg mr-2"
                      />
                      <input
                        type="date"
                        value={editTodo.dueDate}
                        onChange={(e) =>
                          setEditTodo({ ...editTodo, dueDate: e.target.value })
                        }
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      {error && <p className="text-red-500">{error}</p>}
                      <button
                        type="submit"
                        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-col">
                      <p
                        className={`${todo.isCompleted ? "line-through" : ""}`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {todo.dueDate}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-x-5">
                  {/* Edit Icon */}
                  <i
                    className="fa-regular fa-pen-to-square cursor-pointer"
                    onClick={() => handleEditClick(index)} // Start editing
                  ></i>
                  {/* Delete Icon */}
                  <i
                    className="fa-regular fa-trash-can cursor-pointer"
                    onClick={() => handleDeleteTodo(todo._id)} // Call delete function
                  ></i>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
