// MAIN PAGE FOR DISPLAYING TASKS AND LISTS
// This component displays the list of tasks and lists, and allows the user to add, edit, and delete tasks and lists.

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
  const [taskStack, setTaskStack] = useState([]); // Initialize the task stack with an empty array


  const [editListId, setEditListId] = useState(null);
  const [newListName, setNewListName] = useState('');

  const refreshData = () => {
    getData();
  };

  // Get the data when the component is first mounted
  useEffect(() => {
    getData();
    setSelectedTaskId(null);
    setSelectedListId(null);
    setEditListId(null); 
  }, []);

  // Get the data from the server
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

  // Handle the click event for a list
  // Sets the list ID to current list ID and sets the view to tasks
  function onClickList(listId) {
    setSelectedListId(listId);
    setSelectedTaskId(null);
    setView('tasks');
    setEditListId(null); 
  }

  // Handle the click event for a task
  // Sets the task ID to current task ID and sets the view to subtasks
  function onClickTask(taskId) {
    setTaskStack((prevStack) => [...prevStack, taskId]);
    setSelectedTaskId(taskId);
    setView('subtasks');
  }

  // Handle the click event for the delete list button
  const handleDeleteList = (listId) => {
    axios
      .delete(`/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        console.log('List deleted:', response.data);
        setTaskData((prevData) => ({
          ...prevData,
          lists: prevData.lists.filter((list) => list.list_id !== listId),
        }));
        //refreshData();
      })
      .catch((error) => {
        console.error('Error deleting list', error);
      });
  };

  // Handle the back button
  const handleBackButton = () => {
    // Pop the last task ID from the task stack
    const newStack = [...taskStack];
    const lastTaskId = newStack.pop();
    setTaskStack(newStack);
  
    if (view === 'subtasks') {
      // If there are still task IDs left in the stack, go back to the subtasks view
      if (newStack.length > 0) {
        setSelectedTaskId(newStack[newStack.length - 1]);
        setView('subtasks');
      } else {
        // If the stack is empty, go back to the tasks view
        setSelectedTaskId(null);
        setView('tasks');
      }
    } else if (view === 'tasks') {
      // If in tasks view, go back to the list view
      setSelectedTaskId(null);
      setSelectedListId(null);
      setView('list');
    }
  };


  // Handle the edit list name button
  const handleEditListName = (listId) => {

    // Create a new object with the updated list name
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
        //refreshData();
        setTaskData((prevData) => ({
          ...prevData,
          lists: prevData.lists.map((list) =>
            list.list_id === listId ? { ...list, list_name: newListName } : list
          ),
        }));
        setEditListId(null);
      })
      .catch((error) => {
        console.error('Error updating list name', error);
      });
  };

  return (
    <div>
      <button className= "back" onClick={handleBackButton}>
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div className="Task">
        {/* Display list names */}
        {view === 'list' && (
          <div>
            <h1>Lists</h1>
            <ListForm token={props.token} userId={userId} refreshData={refreshData} />
            <div>
              {taskData.lists.map((list) => (
                <div className = "list" key={list.list_id}>
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
                      <span className="list-title" onClick={() => onClickList(list.list_id)}>{list.list_name}</span>
                      <button onClick={() => setEditListId(list.list_id)}>
                        <i class="fa-regular fa-pen-to-square"></i>
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDeleteList(list.list_id)}>
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Display highest level tasks */}
        {view === 'tasks' && (
          <div>
            <h1>Tasks</h1>
            <TaskForm
              token={props.token}
              userId={userId}
              selectedListId={selectedListId}
              setTaskData={setTaskData}
            />
            {taskData.tasks.filter((task) => task.list_id === selectedListId && !task.parent_task_id).length > 0 ? (
              <TaskList
                lists={taskData.lists}
                tasks={taskData.tasks.filter((task) => task.list_id === selectedListId && !task.parent_task_id)}
                onClickTask={onClickTask} token={props.token} setTaskData={setTaskData}
              />
            ) : (
              <p>No tasks found. Please add a task.</p>
            )}
          </div>
        )}

        {/* Display subtasks */}
        {view === 'subtasks' && (
          <div>
            <h1>Subtasks</h1>
            <TaskForm
              token={props.token}
              userId={userId}
              selectedListId={selectedListId}
              setTaskData={setTaskData}
            />
            {taskData.tasks.filter((task) => task.parent_task_id === selectedTaskId).length > 0 ? (
              <TaskList
                lists={taskData.lists}
                tasks={taskData.tasks.filter((task) => task.parent_task_id === selectedTaskId)}
                onClickTask={onClickTask} token={props.token} setTaskData={setTaskData} /> 
            ) : (
              <p>No subtasks found. Please add a subtask.</p>
            )}
          </div>
        )}
        </div>
      </div>
    );}

    export default Tasks;