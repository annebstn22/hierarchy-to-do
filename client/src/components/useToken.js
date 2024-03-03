// CUSTOM HOOK TO USE, SAVE AND REMOVE TOKEN FROM LOCAL STORAGE 
import { useState } from 'react';


// This custom hook is used to save, remove and use the token from local storage
function useToken() {


  // Get the token from local storage 
  function getToken() {
    const userToken = localStorage.getItem('token');
    return userToken && userToken
  }

  const [token, setToken] = useState(getToken());

  // Save the token to local storage
  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };


  // Remove the token from local storage
  function removeToken() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  }

}

export default useToken;