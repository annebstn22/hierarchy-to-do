// TasksList.js
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, onClickTask, token, refreshData}) => {
  const handleCheckboxChange = (taskId, doneStatus) => {

    console.log('Task ID:', taskId);
    console.log('Done:', !doneStatus);

    const newData = {
      done: !doneStatus
    };

    console.log('Request Payload:', newData);

    axios
      .put(`/tasks/${taskId}`, newData,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((response) => {
        console.log('Task updated:', response.data);
        // Refresh task data
        refreshData();
      })
      .catch((error) => {
        console.error('Error updating task', error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Task deleted:', response.data);
        // Refresh task data
        refreshData();
      })
      .catch((error) => {
        console.error('Error deleting task', error);
      });
  };

  return (
    <div>
        <ul>
        {tasks.map((task) => (
          <div key={'task ' + task.task_id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleCheckboxChange(task.task_id, task.done)}
            />
            <li onClick={() => onClickTask(task.task_id)}>
              {task.done ? ' (Completed) ' : ''}
              {task.task_title}
              <button onClick={() => handleDeleteTask(task.task_id)}>x</button>
              {task.children && task.children.length > 0 && (
                <TaskList tasks={task.children} />
              )}
            </li>
          </div>
        ))}
        </ul>
    </div>
  );
};

export default TaskList;
