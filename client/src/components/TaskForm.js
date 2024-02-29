import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ token, userId, selectedListId, refreshData, setTaskData }) {
  const [taskTitle, setTaskTitle] = useState('');

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    // Create a new task with default values
    const newTask = {
      task_title: taskTitle,
      done: false,
      list_id: parseInt(localStorage.getItem('list_id')) || null,
      parent_task_id: parseInt(localStorage.getItem('task_id')) || null,
    };

    // Send the new task to the server
    axios
      .post('/tasks', newTask, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        console.log('New task details:', response.data);
        // Clear the task title after successful submission
        setTaskTitle('');
        // Refresh task data
        //refreshData();
        setTaskData((prevData) => ({
          ...prevData,
          tasks: [...prevData.tasks, response.data.task], 
        }));
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
