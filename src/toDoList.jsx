import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaCheck,
  FaList,
} from "react-icons/fa";

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    inputRef.current?.focus();
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    const newCompleted = new Set(completedTasks);
    newCompleted.delete(index);
    setCompletedTasks(newCompleted);
  }

  function startEditing(index, task) {
    setIsEditing(index);
    setEditedTask(task);
  }

  function handleEditChange(event) {
    setEditedTask(event.target.value);
  }

  function saveEdit(index) {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? editedTask : task
    );
    setTasks(updatedTasks);
    setIsEditing(null);
  }

  function toggleComplete(index) {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedTasks(newCompleted);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  function clearAllTasks() {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
      setCompletedTasks(new Set());
    }
  }

  return (
    <div className="to-Do">
      <header className="app-header">
        <div className="header-content">
          <FaList className="header-icon" />
          <div>
            <h1>Task Manager</h1>
            <p className="subtitle">Keep track of your daily tasks</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="input-section">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="task-input"
            />
            <button className="add-btn" onClick={addTask}>
              <FaPlus className="btn-icon" />
              <span>Add</span>
            </button>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{tasks.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Done:</span>
              <span className="stat-value">{completedTasks.size}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Left:</span>
              <span className="stat-value">
                {tasks.length - completedTasks.size}
              </span>
            </div>
            {tasks.length > 0 && (
              <button className="clear-btn" onClick={clearAllTasks}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Your task list is empty</h3>
            <p>Add a task to get started</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task, index) => (
              <li
                key={index}
                className={`task-item ${
                  completedTasks.has(index) ? "completed" : ""
                }`}
              >
                <div className="task-content">
                  <button
                    className="complete-btn"
                    onClick={() => toggleComplete(index)}
                    aria-label={
                      completedTasks.has(index)
                        ? "Mark as incomplete"
                        : "Mark as complete"
                    }
                  >
                    {completedTasks.has(index) && (
                      <FaCheck className="check-icon" />
                    )}
                  </button>

                  {isEditing === index ? (
                    <div className="edit-group">
                      <input
                        type="text"
                        value={editedTask}
                        onChange={handleEditChange}
                        className="edit-input"
                        autoFocus
                      />
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(index)}
                      >
                        <FaSave className="btn-icon" />
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="task-text">{task}</span>
                      <div className="task-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(index, task)}
                          aria-label="Edit task"
                        >
                          <FaEdit className="btn-icon" />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(index)}
                          aria-label="Delete task"
                        >
                          <FaTrash className="btn-icon" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ToDoList;
