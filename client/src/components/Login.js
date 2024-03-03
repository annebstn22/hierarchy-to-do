// LOGIN FORM
import { useState } from 'react';
import axios from "axios";

function Login(props) {

    // Create a state to store the login form data  
    const [loginForm, setloginForm] = useState({
      email: "",
      password: ""
    })

    // Send login credentials to the server
    function logMeIn(event) {
      axios({
        method: "POST",
        url:"/token",
        data:{
          email: loginForm.email,
          password: loginForm.password
         }
      })
      .then((response) => {
        props.setToken(response.data.access_token)
        // Save the user_id in local storage
        localStorage.setItem('user_id', response.data.user_id);
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })

      setloginForm(({
        email: "",
        password: ""}))

      event.preventDefault()
    }

    function handleChange(event) { 
      const {value, name} = event.target
      setloginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}

    return (
      <div className='Login'>
        <h1>Login</h1>
          <form className="login">
            <input onChange={handleChange} 
                  type="email"
                  text={loginForm.email} 
                  name="email" 
                  placeholder="Email" 
                  value={loginForm.email} />
            <input onChange={handleChange} 
                  type="password"
                  text={loginForm.password} 
                  name="password" 
                  placeholder="Password" 
                  value={loginForm.password} />
        </form>
        <button onClick={logMeIn}>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
      </div>
    );
}

export default Login;