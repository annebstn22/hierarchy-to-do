import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ token, userId, selectedListId, refreshData }) {
  const [taskTitle, setTaskTitle] = useState('');

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    // Create a new task with default values
    const newTask = {
      task_title: taskTitle,
      done: false,
      list_id: localStorage.getItem('list_id') || null,
      parent_task_id: localStorage.getItem('task_id') || null,
    };

    // Send the new task to the server
    axios
      .post('/tasks', newTask, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        // Clear the task title after successful submission
        setTaskTitle('');
        // Refresh task data
        refreshData();
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  };

  return (
    <div>
      <form onSubmit={handleTaskSubmit}>
        <label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </label>
        <button type="submit">+</button>
      </form>
    </div>
  );
}

export default TaskForm;
