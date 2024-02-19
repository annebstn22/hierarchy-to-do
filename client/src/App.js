import React, {useState, useEffect} from 'react'

function App() {

  const [data, setData] = useState([{}])

  /* Use useeffect to fetch the /members route in the backend, and whatever
  response it gets we put it into json, and wtv is in the json
  we put it into the data state, and put console log to see if 
  we successfully fetched the data */

  useEffect(() => {
    fetch("/tasks").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )

  }, []) 
  /* The empty array makes it run only once */

  return (
    /* check if members array is equaled to undefined, that means the api
      is being fetched so display loading, otherwise api has been fetched, so map every members to a p tag to 
      display the members */
    <div>
      {(typeof data.tasks === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        data.tasks.map((task, i) => (
          <p key={i}>{task}</p>
      ))
    )}
      
    </div>
  )
}

export default App
