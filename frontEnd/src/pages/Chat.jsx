import React, { useEffect, useState,  useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ScrollToBottom from 'react-scroll-to-bottom';
import { ToastContainer, toast } from 'react-toastify';
import { HiOutlineLogout } from "react-icons/hi";
import styled from "styled-components";
import axios from 'axios';
import ChatInput from '../Components/ChatInput';
import { sendMessageRoute, recieveMessageRoute,clearChatRoom,host } from '../utils/APIRoutes';
import io from "socket.io-client";
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for accessibility



function Chat() {
    const socket = io.connect(`${host}`);
    const navigate = useNavigate();
    const [messagelist, setMessageList]= useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { roomId,password } = useParams();
    var chatroom=roomId


    //to get the msg from backend
    useEffect(()=>{
      const getMsg = async() =>{
        const data = await JSON.parse(
          localStorage.getItem("REACT_APP_LOGIN_KEY")
        );
        const response = await axios.post(`${recieveMessageRoute}`, {
          from: data,
          password: password
        });
        if(response.data.status ===405){
          setMessageList([]);
        }else{
          if(response.data.status===402 || response.data.status===404){
            //if anyerror navigate to the back page
            navigate('/ChatEntry')
          }else{
            setMessageList(response.data);
          }
        }
      }
      getMsg();
    },[chatroom]);


    //To send the msg
    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(
          localStorage.getItem("REACT_APP_LOGIN_KEY")
        );
        try{
          const response = await axios.post(`${sendMessageRoute}`, {
            message: msg,
            userID: data,
          });

          if (response.data.status === 405) {
            toast.error("Can't send the message as other person didn't join the Chat");
          } else {
           // if no error in backend then do the socket to send the msg
            socket.emit("send_message", {
              room: chatroom,
              from: data,
              msg,
              senderAvtar: response.data.otherAvatar,
              time:
              new Date(Date.now()).getHours() +
              ":" +
             new Date(Date.now()).getMinutes(),
            });
            const time=  new Date(Date.now()).getHours() +  ":" + new Date(Date.now()).getMinutes()
            const avatar = await JSON.parse(
              localStorage.getItem("REACT_APP_AVATAR_KEY")
            );   
            setMessageList((prev) => [...prev, { fromSelf: true, message: msg, time: time, senderAvatar: avatar}]);
          }

        }catch(error){
          if (error.response && error.response.status === 405) {
            toast.error("Can't send the message as other person didn't join the Chat");
          } else {
            toast.error("Something went wrong");
          }
        }        
      };
 //socket connection to recieve the msg
    useEffect(() => {
      if(socket){
        socket.on('connect', () => {
          socket.emit('join_room', chatroom); // Replace with your room ID
        });

            socket.on("receive_message", (msg) => {
              const data =  JSON.parse(
                localStorage.getItem("REACT_APP_LOGIN_KEY")
                )
                if(data !==msg.from ){
                  setArrivalMessage({fromSelf: false,  message: msg.msg, from: msg.from, room: msg.room, senderAvatar:msg.senderAvtar, time:msg.time});
                }       
            }); 
      }        
      }, [socket, chatroom]);


      //once the msg recieve from backend (socket) handle as you want 

      useEffect(() => {
        if (arrivalMessage) {
          setMessageList((prev) => {
            if (Array.isArray(prev)) {
              return [...prev, arrivalMessage];
            } else {
              if(prev.status===405){
               
              }
              return [arrivalMessage];
            }
          });
        }
      }, [arrivalMessage]);


      //logout button function
      const handleLogoutClick = () => {
        setIsModalOpen(true);
      };
    
      const handleConfirmLogout = async() => {
        const data = await JSON.parse(
          localStorage.getItem("REACT_APP_LOGIN_KEY")
        );
        await axios.post(`${clearChatRoom}/${chatroom}`,{
          from: data,
        })
        .then(response=>{
          if(response.status===200){
            navigate('/ChatEntry')
          }
          else{
            toast.error('Something went wrong CHat is not cleared ');
          }
        })
        .catch(err=>{
          toast.error('Something went wrong CHat is not cleared ');
        })
        
        setMessageList([]);
        setIsModalOpen(false);
      };
    
      const handleCancelLogout = () => {
        setIsModalOpen(false);
      };

      const handleNavigateBack =()=>{
        setIsModalOpen(false);
        navigate('/ChatEntry')
      }

      
  return (
    <Container>
       <div className="chat-window"> 
      <div className="chat-content">
       <div className="chat-header">
        <div className="avatar">
            <img src="/Images/MCIS_Logo.png" alt="MCSI Logo"></img>
        </div>
            <p>
                {roomId}
            </p>
            <button className="button" onClick={handleLogoutClick}><HiOutlineLogout /></button>
        </div>
        <div className="chat-body">
        <ScrollToBottom className='message-container'>
      {messagelist && messagelist.length > 0 ? (
        messagelist.map((messageContent, index) => (
          <div 
            className="message" 
            id={messageContent.fromSelf ? "you" : "other"} 
            key={index} // Make sure to add a unique key for each element in the list
          >
             <div className="message-header">
            {messageContent.fromSelf ? (
            <>
              <div className="message-content">
                <p>{messageContent.message}</p>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                </div>
              </div>
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(messageContent.senderAvatar)}`}
                alt="avatar"
                className="avatar"
              />
            </>
          ) : (
            <>
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(messageContent.senderAvatar)}`}
                alt="avatar"
                className="avatar"
              />
              <div className="message-content">
                <p>{messageContent.message}</p>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </>
          )}
        </div>
        </div>
        ))
      ) : (
        <p></p> // Fallback UI when messageList is empty
      )}
    </ScrollToBottom>
        </div>

        <ChatInput handleSendMsg={handleSendMsg}/>
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
        <p>Closing the chat forever. Are you sure you want to clear the Room ID and chat? if not you can just navigate back</p>
        <div className="modal-buttons">
        <button onClick={handleConfirmLogout} className=" modal-button">OK</button>
        <button onClick={handleNavigateBack} className=" modal-button">Navigate Back</button>
        <button onClick={handleCancelLogout} className=" modal-button">Cancel</button>
        </div>
        
      </Modal>
      <ToastContainer/>
    </Container>
  )
}

export default Chat


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
`;