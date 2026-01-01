import React, { useState, useEffect } from "react";

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [editedTask, setEditedTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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
    const noTasks = tasks.filter((_, i) => i !== index);
    setTasks(noTasks);
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

  return (
    <div className="to-Do">
      <h1>To-Do List</h1>
      <div className="textbox">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>
        <hr />
        <ol>
          {tasks.map((task, index) => (
            <li key={index}>
              {isEditing === index ? (
                <>
                  <input
                    type="text"
                    className="text"
                    value={editedTask}
                    onChange={handleEditChange}
                  />
                  <button className="save-btn" onClick={() => saveEdit(index)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="text">{task}</span>
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(index, task)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(index)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ToDoList;
