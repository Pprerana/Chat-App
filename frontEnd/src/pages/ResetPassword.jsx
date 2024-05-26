import React,{useState} from 'react';
import axios from 'axios';
import {Link } from "react-router-dom";
import {resetpassword} from '../utils/APIRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const[newPassword,setNewPassword]= useState('');

    const handleSubmit=async(event)=>{
      event.preventDefault();
        axios.put(`${resetpassword}`,{email,password,newPassword})
        .then(response=>{
            toast.success("Password changed succesfully")
            setEmail('');
            setPassword('')
            setNewPassword('')
            
        })
        .catch(err=>{
            if(err.response.status === 401){
              toast.error("Password or EmailId not matching")
            }else{
              toast.error("error while updating the password")
            }
           
        })
    }
  return (
    <div className="forgot-body">
        <h3> Reset the Password</h3>
        <form onSubmit={(e)=>handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px', padding: '10px', width: '300px' ,border: 'none', borderRadius: '10px', }}
        />
        <input
          type="password"
          placeholder="Enter your old password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '10px', padding: '10px', width: '300px' ,border: 'none', borderRadius: '10px', }}
        />
        <input
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ margin: '10px', padding: '10px', width: '300px' ,border: 'none', borderRadius: '10px', }}
        />
        <button type="submit" style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#000000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Submit</button>
      </form>
      <div>
      <Link to="/login">Login </Link>
      </div>
      <ToastContainer/>

    </div>
  )
}

export default ResetPassword