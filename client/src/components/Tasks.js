import { useState } from 'react'
import axios from "axios";
import TaskList from './TasksList';

function Tasks(props) {

  const [taskData, setTaskData] = useState({ tasks: [] })
  function getData() {
    axios({
      method: "GET",
      url:"/tasks",
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      setTaskData(({
        tasks: res.tasks}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  return (
    <div className="Task">
      <p>To get your task details: </p>
      <button onClick={getData}>Click me</button>
      {taskData && (
        <div>
          {typeof taskData.tasks === 'undefined' ? (
            <p>No tasks</p>
          ) : (
            <TaskList tasks={taskData.tasks} />
          )}
        </div>
      )}
    </div>
  );

}

export default Tasks;