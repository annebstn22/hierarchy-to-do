import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TasksList';
import useLocalStorage from './useLocalStorage';
import TaskForm from './TaskForm';

function Tasks(props) {
  // State variables
  const userId = localStorage.getItem('user_id');
  const [view, setView] = useState('list'); // 'list', 'tasks', 'subtasks'
  const [selectedListId, setSelectedListId] = useLocalStorage('list_id', null);
  const [selectedTaskId, setSelectedTaskId] = useLocalStorage('task_id', null);
  const [taskData, setTaskData] = useState({ tasks: [], lists: [] });

  // Function to refresh data
  const refreshData = () => {
    getData();
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    getData();
    setSelectedTaskId(null);
    setSelectedListId(null);
  }, []); // Empty dependency array ensures it runs only once on mount

  // Function to fetch data from the server
  function getData() {
    axios({
      method: 'GET',
      url: '/tasks',
      params: {
        user_id: userId
      },
      headers: {
        Authorization: 'Bearer ' + props.token,
      },
    })
      .then((response) => {
        const res = response.data;
        res.access_token && props.setToken(res.access_token);

        // Set task data and default view to list
        setTaskData({
          tasks: res.tasks,
          lists: res.lists,
        });
        setView('list');
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }



  // Function to handle click on a list
  function onClickList(listId) {
    setSelectedListId(listId);
    setSelectedTaskId(null);
    setView('tasks'); // Switch to the tasks view
  }

  // Function to handle click on a task
  function onClickTask(taskId) {
    setSelectedTaskId(taskId);
    setView('subtasks'); // Switch to the subtasks view
  }

  return (
    <div className="Task">
      {/* Display list names */}
      {view === 'list' && (
        <div>
          <p>Lists:</p>
          <ul>
            {taskData.lists.map((list) => (
              <li key={list.list_id} onClick={() => onClickList(list.list_id)}>
                {list.list_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display highest level tasks */}
      {view === 'tasks' && (
        <div>
          <p>Tasks</p>
          <TaskForm
            token={props.token}
            userId={userId}
            selectedListId={selectedListId}
            refreshData={refreshData}
          />
          {taskData.tasks.filter((task) => task.list_id === selectedListId && !task.parent_task_id).length > 0 ? (
            <TaskList
              tasks={taskData.tasks.filter((task) => task.list_id === selectedListId && !task.parent_task_id)}
              onClickTask={onClickTask}
            />
          ) : (
            <p>No tasks found. Please add a task.</p>
          )}
        </div>
      )}

      {/* Display subtasks */}
      {view === 'subtasks' && (
        <div>
          <p>Subtasks:</p>
          <TaskForm
            token={props.token}
            userId={userId}
            selectedListId={selectedListId}
            refreshData={refreshData}
          />
          {taskData.tasks.filter((task) => task.parent_task_id === selectedTaskId).length > 0 ? (
            <TaskList
              tasks={taskData.tasks.filter((task) => task.parent_task_id === selectedTaskId)}
              onClickTask={onClickTask}
            />
          ) : (
            <p>No subtasks found. Please add a subtask.</p>
          )}
        </div>
      )}
      </div>
      );}

      export default Tasks;