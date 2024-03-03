// HEADER FOR LOGOUT
// This component displays the logout button and allows the user to log out of the application.

import axios from "axios";

function Header(props) {

  // Function to log out the user
  function logMeOut() {
    axios({
      method: "POST",
      url:"/logout",
    })
    .then((response) => {
       props.token()
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    return(
        <header className="App-header">
            <button className = "logout" onClick={logMeOut}> 
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        </header>
    )
}

export default Header;
