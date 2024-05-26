import React,{useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ressettingForgetPassword } from '../utils/APIRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetForgotPassword = () => {
  const { token } = useParams();
    const [password, setPassword]= useState('');
    const [email, setEmail] = useState('')

    const validateInput =()=>{
      if(password === ''){
        toast.error("Please give the new password");
        return false
      }
      if(email===""){
        toast.error("Please give the mail Id");
        return false
      }
      return true
    }

    const submitPassword = async(event)=>{
      event.preventDefault(); // Prevent default form submission behavior
      const validate = validateInput()
      if(validate){
       await axios.put(`${ressettingForgetPassword}`,{password, email, token})
        .then(response=>{
            const {status} = response
            if(status===200){
               toast.success("Password got resetted please go to the login page")

            }
        })
        .catch(err=>{
            if(err){
                toast.error("Something went wrong")
            }
        })
      }
        
    }

    const handleKeyPress = (event)=>{
      if (event.key === 'Enter') {
        submitPassword(event);
      }
    }
    
  return (
    <div className="forgot-body">
        <h3> Reset the password </h3>
        <form onSubmit={(e) => submitPassword(e)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px', padding: '10px', width: '300px' ,border: 'none', borderRadius: '10px', }}
        />
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '10px', padding: '10px', width: '300px' ,border: 'none', borderRadius: '10px', }}
          onKeyPress={handleKeyPress}
        />
        <button type="submit" style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#000000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Submit</button>
      </form>
      <div>
        <a href="/login">Login</a>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default ResetForgotPassword