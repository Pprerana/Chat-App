import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login'
import AuthenticationLoading from './pages/AuthenticationLoading';
import ForgotPassword from './pages/ForgotPassword';
import ResetForgotPassword from './pages/ResetForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Avatar from './Components/Avatar';
import ChatRoomEntry from './pages/ChatRoomEntry';
import Chat from './pages/Chat';
import InviteFriend from './pages/InviteFriend';


function App() {


  return (
    
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="/authorizing/:token" element={<AuthenticationLoading />} />
        <Route path="forgot-password" element={<ForgotPassword />}/>
        <Route path="forgot-password/reset-password/:token" element={<ResetForgotPassword/>}/>
        <Route path="reset-password" element={<ResetPassword/>}/>
        <Route path="Avtar" element={<Avatar/>}/>
        <Route path="ChatEntry" element={<ChatRoomEntry />}></Route>
        <Route path ="/chat/:roomId/token/:password" element={<Chat/>} />
        <Route path="/ChatEntry/InviteFriend" element={<InviteFriend/>}/>
      </Routes>
      </BrowserRouter>

    
  );
}

export default App;
