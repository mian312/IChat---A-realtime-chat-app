import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
// import Navbar from './components/Navbar';
import Login from './components/authentication/Login'
import Elogin from './components/authentication/Elogin'
import Register from './components/authentication/Register';
import Reset from './components/authentication/Reset';
import Chats from './components/Chats/Chats';
import NotFound from './components/NotFound';
// import Demo from './components/Chats/Demo';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/elogin" element={<Elogin />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route exact path="/chat" element={<Chats />} />
        {/* <Route exact path="/demo" element={<Demo />} /> */}
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
