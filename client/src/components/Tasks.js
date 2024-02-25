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

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    getData();
  }, []); // Empty dependency array ensures it runs only once on mount

  // Function to handle click on a list
  function onClickList(listId) {
    setSelectedListId(listId);
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
          <ul>
            {taskData.tasks
              .filter(
                (task) => task.list_id === selectedListId && !task.parent_task_id
              )
              .map((task) => (
                <li key={task.task_id} onClick={() => onClickTask(task.task_id)}>
                  {task.task_title}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Display subtasks */}
      {view === 'subtasks' && (
        <div>
          <p>Subtasks:</p>
          <TaskList
            tasks={taskData.tasks.filter(
              (task) => task.parent_task_id === selectedTaskId
            )}
          />
        </div>
      )}
    </div>
  );
}

export default Tasks;

