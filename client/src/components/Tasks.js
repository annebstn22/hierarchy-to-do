import { useState } from 'react'
import axios from "axios";

function Tasks(props) {

  const [taskData, setTaskData] = useState(null)
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
        task_name: res.name}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  return (
    <div className="Task">

        <p>To get your task details: </p><button onClick={getData}>Click me</button>
        {taskData && <div>
              <p>Task name: {taskData.task_name}</p>
            </div>
        }

    </div>
  );
}

export default Tasks;