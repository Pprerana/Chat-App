import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {inviteAFriend} from '../utils/APIRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InviteFriend() {
    const [email, setEmail] = useState('');
    const [roomId, setRoomId] = useState('');
    const navigate= useNavigate()

    const handleverification =()=>{
        if(!email && !roomId){
            toast.error("please provide the Email Id for whom You want to send and Room ID You want to invte")
            return false
        }
        if(!email){
            toast.error("please provide the Email Id for whom You want to send  ")
            return false
        }
        if(!roomId){
            toast.error("please provide the Room Id for which You want to send the invitation ")
            return false
        }
        return true

    }
    const handleSubmit =async(e)=>{
        e.preventDefault();
        const validate =handleverification()
        if(validate){
            try{
                const userId = await JSON.parse(
                    localStorage.getItem("REACT_APP_LOGIN_KEY"))
                    if(userId==='' || !userId){
                        navigate('/login');
                    }
                    const response=  await axios.post(`${inviteAFriend}`,{email,roomId})
                    if(response.data.status==="success"){
                        toast.success("Email has been sent");
                        setEmail('')
                        setRoomId('')
                    }
                    if(response.data.status===401){
                        toast.error("Room Id Doesn't exist");
                    }
                    if(response.data.status===405){
                        navigate('/login');
                    }
            }catch(error){
                if(error.data.status===401){
                    toast.error("Room Id Doesn't exist");
                }
                if(error.data.status===405){
                    navigate('/login');
                }
                toast.error("Something went wrong")
    
            }
        }
    }

    const handleNavigate =()=>{
        navigate('/ChatEntry')
      }
  return (
    <div className='forgot-body' >
        <h3> Please enter your friend Email Id and the Room ID  </h3>
        <form  >
        <input
          type="email"
          placeholder="Enter Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          
          required
        />

        <input
          type="text"
          placeholder="Enter your Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          
          required
        />

        <button type="submit" onClick={handleSubmit}>Submit</button>
        <button  onClick={handleNavigate}>Back</button>
      </form>
      <ToastContainer/>

    </div>
  )
}

export default InviteFriend