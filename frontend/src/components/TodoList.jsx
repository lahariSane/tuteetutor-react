import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: "", dueDate: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: "", dueDate: "" });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [token]);

  const validateDate = (date) => new Date(date) >= new Date();

  const handleAddTodo = (e) => {
    e.preventDefault();

    console.log("Adding newTodo:", newTodo);

    if (!validateDate(newTodo.dueDate)) {
      setError("Deadline cannot be in the past.");
      return;
    }

    console.log("Token being sent:", token);

    fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTodo),
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Error adding todo.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo({ title: "", dueDate: "" });
        setShowForm(false);
        setError("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const handleTodoDoneIcon = (id) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    const updatedTodo = {
      ...todoToUpdate,
      isCompleted: !todoToUpdate.isCompleted,
    };

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((updated) => {
        setTodos(todos.map((todo) => (todo._id === id ? updated : todo)));
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const handleEditClick = (index) => {
    if (index < 0 || index >= todos.length) return;
    setEditIndex(index);
    setEditTodo({ title: todos[index].title, dueDate: todos[index].dueDate });
  };

  const handleSaveEdit = (e, id) => {
    e.preventDefault();
    if (!validateDate(editTodo.dueDate)) {
      setError("Edited deadline cannot be in the past.");
      return;
    }

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editTodo),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
        setEditIndex(null);
        setError("");
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  return (
    <div>
      <div className="flex flex-row px-5 mx-5 my-5 bg-gray-100 rounded-lg py-5 justify-end items-center">
        <AddIcon
          fontSize="large"
          className="hover:text-purple-500 hover:scale-125 transition-transform duration-200 cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        />
      </div>

      {showForm && (
        <div className="mx-auto my-6 max-w-md py-8 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Add a New To-Do
          </h2>
          <form onSubmit={handleAddTodo}>
            <div className="flex flex-col space-y-4">
              {/* Input for To-Do Title */}
              <input
                type="text"
                placeholder="Enter To-Do Title"
                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                required
              />

              <input
                type="date"
                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTodo.dueDate}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, dueDate: e.target.value })
                }
                required
              />

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="p-3 bg-blue-500 text-white font-medium rounded-md w-full hover:bg-blue-600 transition duration-200"
              >
                Add To-Do
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-5 mx-5 my-5">
        <ul className="flex-column space-y-4 text-sm font-medium text-black">
          {todos.map((todo, index) => (
            <li key={todo._id}>
              <div className="select-none cursor-pointer bg-gray-100 rounded-md flex flex-1 items-center justify-between p-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex flex-row items-center space-x-5">
                  <i
                    className={`fa-${
                      todo.isCompleted
                        ? "solid fa-circle-check"
                        : "regular fa-circle"
                    } cursor-pointer text-2xl ${
                      todo.isCompleted ? "text-yellow-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTodoDoneIcon(todo._id)}
                  ></i>

                  {editIndex === index ? (
                    <form
                      onSubmit={(e) => handleSaveEdit(e, todo._id)}
                      className="my-6 max-w-md py-8 bg-white shadow-md rounded-md"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                        Edit To-Do
                      </h2>
                      <div className="flex flex-col space-y-4">
                        {/* Input for To-Do Title */}
                        <input
                          type="text"
                          placeholder="Edit To-Do Title"
                          className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={editTodo.title}
                          onChange={(e) =>
                            setEditTodo({ ...editTodo, title: e.target.value })
                          }
                          required
                        />

                        {/* Input for Due Date */}
                        <input
                          type="date"
                          className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={editTodo.dueDate}
                          onChange={(e) =>
                            setEditTodo({
                              ...editTodo,
                              dueDate: e.target.value,
                            })
                          }
                          required
                        />

                        {/* Error Message */}
                        {error && (
                          <p className="text-red-500 text-center text-sm">
                            {error}
                          </p>
                        )}

                        {/* Save Button */}
                        <button
                          type="submit"
                          className="p-3 bg-blue-500 text-white font-medium rounded-md w-full hover:bg-blue-600 transition duration-200"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col">
                      <p
                        className={`${
                          todo.isCompleted ? "line-through" : ""
                        } text-2xl text-bold`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xl text-gray-400 mt-1">
                        Due: {todo.dueDate}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-x-8">
                  <i
                    className="fa-regular fa-pen-to-square cursor-pointer text-2xl"
                    onClick={() => handleEditClick(index)}
                  ></i>
                  <i
                    className="fa-regular fa-trash-can cursor-pointer text-2xl text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteTodo(todo._id)}
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
