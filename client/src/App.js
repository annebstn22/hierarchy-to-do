import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Header from './components/Header'
import useToken from './components/useToken'
import Tasks from './components/Tasks'
import './App.css'

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <BrowserRouter>
      <main className="App">
        <Header token={removeToken}/>
        {!token && token!=="" &&token!== undefined?  
        <Login setToken={setToken} />
        :(
          <>
            <Routes>
              <Route exact path="/tasks" element={<Tasks token={token} setToken={setToken}/>}></Route>
              <Route path="/" element={<Tasks token={token} setToken={setToken}/>} />
            </Routes>
          </>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;