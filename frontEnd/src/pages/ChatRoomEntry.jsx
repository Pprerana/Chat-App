import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createRoomId } from "../utils/APIRoutes";
import { jointheRoom } from "../utils/APIRoutes";
import { HiOutlineLogout } from "react-icons/hi";
import { FaBars } from 'react-icons/fa';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const ChatRoomEntry = () => {
    const [roomId, setRoomId]=useState('');
    const [password, setPassword] = useState('');
    const[newRoomId, setNewRoomID] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    //validate the room id and password
    const validateInput=()=>{
      if(roomId==='' && password===''){
        toast.error("Please enter the Room Id and Password");
        return false
      }
      else if(roomId===''){
        toast.error("Please enter the valid Room Id");
        return false
      }
      else if(password===''){
         toast.error("Please enter the Password");
         return false
      }
      else{
        return true
      }
    }

    const handleKeyPressOnPassword =(event)=>{
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }
//validate the room id and password and get the reponse from backend
    const handleSubmit=async()=>{
      const validation= validateInput()
      if(validation){const user = await JSON.parse(
        localStorage.getItem("REACT_APP_LOGIN_KEY")
      );
      const userId= user;
        const {data} = await axios.get(`${jointheRoom}`)
        if(data.isSet){
          toast.success("password and roomid matched")
          navigate(`/chat/${roomId}/token/${password}`)
        } else{
          if(data.status===451){
            toast.error("Already Two People are there in the chat")
          }else{
            if(data.status===401)
            toast.error("Password is not matching")
          }
          if(data.status === 500){
            toast.error("Some error occured")
          }
        }
      }
    }

    //validate the new room Id
    const validateRoomID=()=>{
      if(newRoomId===""){
        toast.error("Please provide the New Room ID");
        return false
      }else{
        const regex = /^[1-9][0-9]{3}$/;
        if(regex.test(newRoomId)){
          return true
        }
        else{
          toast.error("Please provide the Room ID between 1000 to 9999");
          return false
        }
      }
      
    }

    const handleKeyPress =(event)=>{
      if (event.key === 'Enter') {
        handleSubmitForNewRoomID();
      }
    }

    //create the room id
    const handleSubmitForNewRoomID=async()=>{
      const validation= validateRoomID()
      if(validation){
        const userId = await JSON.parse(
          localStorage.getItem("REACT_APP_LOGIN_KEY"))
        const {data} = await axios.post(`${createRoomId}`,{userId, newRoomId})
        if(data.isSet){
          toast.success(`Romm Id is created Password is: ${data.password} please do save it somewhere as it's only visible for once`)
          setNewRoomID('');
        } else{
          if(data.status==="409"){
            toast.error("The RoomId is already Taken for today!")
          }
          else{
            toast.error("Some error occured")
          }
        }
      }
    }


    const handleLogoutClick = () => {
      setIsModalOpen(true);
    };
  
    const handleConfirmLogout = () => {
      localStorage.removeItem("REACT_APP_LOGIN_KEY");
      localStorage.removeItem("REACT_APP_AVATAR_KEY");
      localStorage.removeItem("REACT_APP_USERNAME");
      navigate('/login');
      setIsModalOpen(false);
    };
  
    const handleCancelLogout = () => {
      setIsModalOpen(false);
    };
    const handleInviteLink =()=>{
      navigate('/ChatEntry/InviteFriend')
    }


    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
    
  return (
    <div className='chat-main-page' >
       <div className="header-content">
        <div>
          <img src="/Images/MCIS_Logo.png" alt="Logo" />
        </div>
        <div >
          <h2 className='h2-chatroom'> Create Room Id or Join Room </h2>
        </div>
        <div className="desktop-menu">
          <button className="logout-button" onClick={handleInviteLink}>Invite a Friend</button>
          <button className="logout-button" onClick={handleLogoutClick}><HiOutlineLogout /></button>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>
      </div>
      {menuOpen && (
        <div className="menu-options">
          <div className="logout-button" onClick={handleInviteLink}>Invite a Friend</div>
          <button className="logout-button" onClick={handleLogoutClick}>LogOut</button>
        </div>
      )}
        <div className='chat-main-input'>
        <h2 className='h2-chatroom'> Have a Room Id enter it </h2> 
        <input
        type="text"
        value={roomId}
        placeholder='Room Id'
        onChange={(event)=>
           setRoomId(event.target.value)
        }
        >
        </input>
        <input
        type="password"
        value={password}
        placeholder='Password'
        onChange={(event)=>
           setPassword(event.target.value)

        }
        onKeyPress={handleKeyPressOnPassword}
        >
        </input>

        <button onClick={handleSubmit}> Sumbit</button>
        <div className="line2"></div>
        </div>

        <div>
        <h2>Create a room id </h2>
        <div className='chat-main-input'>
            <input
            type="text"
            value={newRoomId}
            placeholder=' Give Room ID between 1000-9999'
            onChange={(event)=>{
                setNewRoomID(event.target.value)
            }}
            onKeyPress={handleKeyPress}
            >
            </input>
            <button onClick={handleSubmitForNewRoomID}> Sumbit</button>
        </div>
        </div>
        <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancelLogout}
        contentLabel="Confirm Logout"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to Logout?</p>
        <div className="modal-buttons">
          <button onClick={handleConfirmLogout} className="modal-button">OK</button>
          <button onClick={handleCancelLogout} className="modal-button">Cancel</button>
        </div>
      </Modal>
       
        <ToastContainer/>
    </div>
  )
}

export default ChatRoomEntry