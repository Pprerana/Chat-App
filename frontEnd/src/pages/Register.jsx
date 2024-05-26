import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import GoogleOauth from '../Components/GoogleOauth';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {manualsignup} from '../utils/APIRoutes'

function Register() {
  const [name, setName] = useState("");
  const [emailId, setEmailID] = useState("");
  const [password, setPassWord] = useState("");
  const [showGoogleAuth, setShowGoogleAuth] = useState(false); 
  const [emailValid, setEmailValid] = useState(true);
  const [errorPassword, setErrorPassword] = useState(false)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#&%^*_\-+])[A-Za-z\d@!#&%^*_\-+]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
  const handleKeyPress = (event)=>{
    if (event.key === 'Enter') {
      signUp();
    }
  }

  
  const validateInput =()=>{
    if(name==='' && emailId==='' && password===''){
      toast.error("Please enter the Name, Email ID and Password");
        return false
    }
    if(name===""){
      toast.error("Please enter the Name");
      return false
    }
    if(emailId==='' && password===''){
      toast.error("Please enter the Email ID and Password");
        return false
    }else{
      if(emailId && password !==''){
        const emailvalid = emailRegex.test(emailId)
        if(emailvalid){
          setEmailValid(true)
        }else{
          setEmailValid(false)
          return false;
        }
        if(password){
          const passwordtest =passwordRegex.test(password)
          if(passwordtest){
            setErrorPassword(false)
            return true;
          }else{
            setErrorPassword(true)
            return false;
          }
        }
      }
    }
    if(emailId === ''){
      toast.error("Please enter the Email Id");
        return false;
    }
    if(password===''){
      toast.error("Please enter the Password");
        return false;
    }else{
      const passwordtest =passwordRegex.test(password)
    }
  }


  //signUp button function
  const signUp=()=>{
    const validation = validateInput();
    if(validation){
        axios.post(`${manualsignup}`,{ name, emailId,password})
        .then(response=>{
          toast.success(' Sent the verification link!');
        })
        .catch(err=>{
          if (err.response) {
            const { status } = err.response;
            if (status === 422) {
              toast.error('User already exists!');
            } else {
              if(status===500){
                toast.error('An error occurred. Please try again later.');
              }             
            }
          } else {
            toast.error('An error occurred. Please try again later.');
          }
        })

    }
        
      
  }
  const toggleGoogleAuth = () => {
    setShowGoogleAuth(true);
  }

//handle the response from google auth
  const handleResponse = (status, response) => {
    if (status === 'success') {
        toast.success('Sent the verification link!');
    } else {
      if(status === 422){
        toast.error('User already exists!');
      }else{
        toast.error('Registration failed!');
      }
        
    }
};


  return (
    <div className='container' >
      <div className='left-side'>
      <h2 >
        Register
      </h2>
      <input 
      type="text"
      placeholder="Your Name"
      onChange={(event) => {
        setName(event.target.value);}} 
        style={{justifyContent:'center'}}/>

      <input 
        type="email"
        placeholder="Your Email Id"
        onChange={(event) => {
          setEmailID(event.target.value);}} 
        style={{justifyContent:'center'}}/>
        {!emailValid && (
          <p style={{color: 'red'}}>Invalid email format </p>
          
        )}
        
       <input
        type= "password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassWord(event.target.value)}
        onKeyPress={handleKeyPress}
      />
      {errorPassword &&
      (<p style={{ color: 'red',  }}>Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@!#&%^*_-+).</p> )}
       
      <br />


      <button onClick={signUp} > Register </button>
      <p className='line'></p>

      {showGoogleAuth ? (
          // Render GoogleOauth component if showGoogleAuth is true
          <GoogleOauth isSignup={true} handleResponse={handleResponse}  />
        ) : (
          // Render button to sign up with Google
          <button className="google-button" onClick={toggleGoogleAuth}>Sign up with Google</button>
        )}
      <p> Already have account!   <Link to="/login"> Go to Login</Link> </p>
      </div>
      <div className="right-side">
        <div className="welcome-text">
          <p className="bold-text">Welcome to MCSI</p>
        </div>
          <img className="image" src="/Images/MCIS_Logo.png" alt="MCSI Logo" />
        
      </div>
      <ToastContainer />
      </div>
  )
}

export default Register