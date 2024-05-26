import React,{useState} from 'react';
import axios from 'axios';
import {forgotEmail} from '../utils/APIRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate} from "react-router-dom";

const ForgotPassword = () => {
  const navigate= useNavigate()
    const [email, setEmail] = useState('');


    //handle the submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${forgotEmail}`, { email });
          toast.success(" Reset Mail has been sent")
          setEmail('')
        } catch (error) {
          toast.error("Something went wrong")
        }
      };
    const handleNavigate =()=>{
      navigate('/login')
    }
  return (
    <div className='forgot-body' >
        <h3> Please enter your email id</h3>
        <form  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px', padding: '10px', width: '300px' ,border: 'none', borderRadius: '10px', }}
        />
        <button type="submit" style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#000000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }} onClick={handleSubmit}>Submit</button>
        <button type="submit" style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#000000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }} onlick={handleNavigate}>Back</button>
      </form>
      <ToastContainer/>

    </div>
  )
}

export default ForgotPassword;