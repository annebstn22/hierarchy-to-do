import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TasksList';
import useLocalStorage from './useLocalStorage';
import TaskForm from './TaskForm';
import ListForm from './ListForm';

function Tasks(props) {
  const userId = localStorage.getItem('user_id');
  const [view, setView] = useState('list');
  const [selectedListId, setSelectedListId] = useLocalStorage('list_id', null);
  const [selectedTaskId, setSelectedTaskId] = useLocalStorage('task_id', null);
  const [taskData, setTaskData] = useState({ tasks: [], lists: [] });

  const [editListId, setEditListId] = useState(null);
  const [newListName, setNewListName] = useState('');

  const refreshData = () => {
    getData();
  };

  useEffect(() => {
    getData();
    setSelectedTaskId(null);
    setSelectedListId(null);
    setEditListId(null); 
  }, []);

  function getData() {
    axios({
      method: 'GET',
      url: '/tasks',
      params: {
        user_id: userId,
      },
      headers: {
        Authorization: 'Bearer ' + props.token,
      },
    })
      .then((response) => {
        const res = response.data;
        res.access_token && props.setToken(res.access_token);
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

  function onClickList(listId) {
    setSelectedListId(listId);
    setSelectedTaskId(null);
    setView('tasks');
    setEditListId(null); 
  }

  function onClickTask(taskId) {
    setSelectedTaskId(taskId);
    setView('subtasks');
  }

  const handleDeleteList = (listId) => {
    axios
      .delete(`/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        console.log('List deleted:', response.data);
        refreshData();
      })
      .catch((error) => {
        console.error('Error deleting list', error);
      });
  };

  const handleEditListName = (listId) => {
    const newData = {
      list_name: newListName,
    };

    axios
      .put(`/lists/${listId}`, newData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        console.log('List name updated:', response.data);
        refreshData();
        setEditListId(null);
      })
      .catch((error) => {
        console.error('Error updating list name', error);
      });
  };

  return (
    <div className="Task">
      {/* Display list names */}
      {view === 'list' && (
        <div>
          <p>Lists:</p>
          <ListForm token={props.token} userId={userId} refreshData={refreshData} />
          <ul>
            {taskData.lists.map((list) => (
              <li key={list.list_id}>
                {editListId === list.list_id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditListName(list.list_id);
                    }}
                  >
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                    />
                    <button type="submit">Save</button>
                  </form>
                ) : (
                  <>
                    <div className="list-title" onClick={() => onClickList(list.list_id)}>
                      <span>{list.list_name}</span>
                    </div>
                    <button onClick={() => setEditListId(list.list_id)}>Edit</button>
                  </>
                )}
                <button onClick={() => handleDeleteList(list.list_id)}>x</button>
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
              onClickTask={onClickTask} token={props.token} refreshData={refreshData}
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
              onClickTask={onClickTask} token={props.token} refreshData={refreshData} /> 
          ) : (
            <p>No subtasks found. Please add a subtask.</p>
          )}
        </div>
      )}
      </div>
      );}

      export default Tasks;