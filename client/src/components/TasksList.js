// DISPLAY A LIST OF TASKS FROM THE DATABASE
// This component displays each task with a checkbox, edit button, and delete button.
// It also allows the user to move tasks to different lists.

import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, lists, onClickTask, token, setTaskData }) => {
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

  const handleMoveTask = (taskId, newListId) => {
    const newData = {
      list_id: newListId,
    };

    console.log('newData', newData);

    axios
      .put(`/tasks/${taskId}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTaskData((prevData) => ({
          ...prevData,
          tasks: prevData.tasks.map((task) =>
            task.task_id === taskId ? { ...task, list_id: newListId } : task
          ),
        }));
      })
      .catch((error) => {
        console.error('Error moving task', error);
      });
  };

  return (
    <div>
        {tasks.map((task) => (
          <div className="task" key={'task ' + task.task_id}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleCheckboxChange(task.task_id, task.done)}
              />
              {editingTaskId === task.task_id ? (
                <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRenameTask(task.task_id, e.target.title.value);
                  }}
                >
                  <input type="text" name="title" defaultValue={task.task_title} />
                  <button type="submit">Save</button>
                </form>
                </div>
              ) : (
                <>
                  <span className="task-title" onClick={() => onClickTask(task.task_id)}>{task.task_title}</span>
                  <button onClick={() => setEditingTaskId(task.task_id)}>
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                </>
              )}

              {task.parent_task_id === null ? (
                <select
                  value={task.list_id}
                  onChange={(e) => handleMoveTask(task.task_id, parseInt(e.target.value, 10))}
                >
                  {lists.map((list) => (
                    <option key={list.list_id} value={list.list_id}>
                      {list.list_name}
                    </option>
                  ))}
                </select>
              ) : (
                <div></div>
              )}

              <button onClick={() => handleDeleteTask(task.task_id)}>
                <i class="fa-solid fa-trash"></i>
              </button>
          </div>
        ))}
    </div>
  );
};

export default TaskList;
