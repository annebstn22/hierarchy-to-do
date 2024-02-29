// TasksList.js
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, onClickTask, token, refreshData}) => {
  const [editingTasks, setEditingTasks] = useState([]);
  const [newTaskTitles, setNewTaskTitles] = useState({});

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

  const handleRenameTask = (taskId) => {
    const newData = {
      task_title: newTaskTitles[taskId],
    };

    axios
      .put(`/tasks/${taskId}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        refreshData();
        setEditingTasks((prevEditingTasks) =>
          prevEditingTasks.filter((id) => id !== taskId)
        );
      })
      .catch((error) => {
        console.error('Error renaming task', error);
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
          <div className={'task ' + (task.done ? 'done' : '')} key={'task ' + task.task_id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleCheckboxChange(task.task_id, task.done)}
            />

            <li>
              {task.done ? ' (Completed) ' : ''}

              {!editingTasks.includes(task.task_id) && (
                <div className="task-title" onClick={() => setEditingTasks((prev) => [...prev, task.task_id])}>
                  <span>{task.task_title}</span>
                </div>
              )}

              {editingTasks.includes(task.task_id) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRenameTask(task.task_id);
                  }}>
                  <input
                    type="text"
                    value={newTaskTitles[task.task_id] || task.task_title}
                    onChange={(ev) =>
                      setNewTaskTitles((prevNewTaskTitles) => ({
                        ...prevNewTaskTitles,
                        [task.task_id]: ev.target.value,
                      }))
                    }
                  />
                  <button type="submit">Save</button>
              </form>
              )}

              <button onClick={() => onClickTask(task.task_id)}>-&gt;</button>
              <button onClick={() => handleDeleteTask(task.task_id)}>x</button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;