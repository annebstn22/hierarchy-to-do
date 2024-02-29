// TasksList.js
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, onClickTask, token, setTaskData }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleCheckboxChange = (taskId, doneStatus) => {
    const newData = {
      done: !doneStatus,
    };

    axios
      .put(`/tasks/${taskId}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //refreshData();
        setTaskData((prevData) => ({
          ...prevData,
          tasks: prevData.tasks.map((task) =>
            task.task_id === taskId ? { ...task, done: newData.done } : task
          ),
        }));
      })
      .catch((error) => {
        console.error('Error updating task', error);
      });
  };

  const handleRenameTask = (taskId, newTitle) => {
    const newData = {
      task_title: newTitle,
    };

    axios
      .put(`/tasks/${taskId}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //refreshData();
        setTaskData((prevData) => ({
          ...prevData,
          tasks: prevData.tasks.map((task) =>
            task.task_id === taskId ? { ...task, task_title: newTitle } : task
          ),
        }));
        setEditingTaskId(null);
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
        //refreshData();
        setTaskData((prevData) => ({
          ...prevData,
          tasks: prevData.tasks.filter((task) => task.task_id !== taskId),
        }));
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

              {editingTaskId === task.task_id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRenameTask(task.task_id, e.target.title.value);
                  }}
                >
                  <input type="text" name="title" defaultValue={task.task_title} />
                  <button type="submit">Save</button>
                </form>
              ) : (
                <>
                  <div className="task-title" onClick={() => onClickTask(task.task_id)}>
                    <span>{task.task_title}</span>
                  </div>
                  <button onClick={() => setEditingTaskId(task.task_id)}>Edit</button>
                </>
              )}
              <button onClick={() => handleDeleteTask(task.task_id)}>x</button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
