import React,{useState} from 'react';
import GoogleOauth from '../Components/GoogleOauth';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {loginmanual} from '../utils/APIRoutes'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassWord] = useState("");
  const [showGoogleAuth, setShowGoogleAuth] = useState(false); 
  

  //login button function
  const login=()=>{
    console.log(loginmanual)
        axios.post(`${loginmanual}`,{email,password})
        .then(response=>{
          localStorage.setItem(
            "REACT_APP_LOGIN_KEY",
            JSON.stringify(response.data.userID)
          );
          if(response.data.userAvthar !== ""){
            localStorage.setItem(
              "REACT_APP_AVATAR_KEY",
              JSON.stringify(response.data.userAvthar)
            );
            localStorage.setItem(
              "REACT_APP_USERNAME",
              JSON.stringify(response.data.userName)
            );
            navigate('/ChatEntry')
          }else{
            if(response.data.userAvthar === ""){
              localStorage.setItem(
                "REACT_APP_USERNAME",
                JSON.stringify(response.data.userName)
              );
              navigate(`/Avtar?username=${response.data.userName}`)
            }
          }
          
        })
        .catch(err=>{
          console.log("error occured: ", err);
          const { status } = err.response;
          if (status === 401) {
            // User already exists
            toast.error('Incorrect Password!');
          }
          else {
            if(status===500){
              toast.error('An error occurred. Please try again later.');
            }
          }
        })
  }

  const toggleGoogleAuth = () => {
    setShowGoogleAuth(true);
  }

//handle the reponse from google auth
  const handleResponse = (status, response) => {
   console.log("Login is successfull: ",response)
    if (status === 'success') {
      localStorage.setItem(
        "REACT_APP_LOGIN_KEY",
        JSON.stringify(response.userID)
      );
      if(response.userAvthar !==""){
        localStorage.setItem(
          "REACT_APP_AVATAR_KEY",
          JSON.stringify(response.userAvthar)
        );
        localStorage.setItem(
          "REACT_APP_USERNAME",
          JSON.stringify(response.userName)
        );
        navigate('/ChatEntry')
      }else{
        if(response.userAvthar === ''){
          localStorage.setItem(
            "REACT_APP_USERNAME",
            JSON.stringify(response.userName)
          );
          navigate(`/Avtar?username=${response.userName}`)
        }
      }
        
    } else {
        toast.error('Login failed!');
    }
};

const handleKeyPress = (event)=>{
  if (event.key === 'Enter') {
    login();
  }
}

  return (
    <div className='container' >
      <div className='left-side'>
      <h2 >
        Login 
      </h2>
      <input 
      type="text"
      placeholder="E-Mail Id"
      onChange={(event) => {
        setEmail(event.target.value);}} 
        style={{justifyContent:'center'}}/>
        
      <input 
        type="password"
        placeholder="Your Password"
        onChange={(event) => {
        setPassWord(event.target.value);}} 
        onKeyPress={handleKeyPress}/>
       

      <button onClick={login} > Login </button>
      <p className='line'></p>

      {showGoogleAuth ? (
          // Render GoogleOauth component if showGoogleAuth is true
          <GoogleOauth isSignup={false} handleResponse={handleResponse}/>
        ) : (
          // Render button to sign up with Google
          <button className="google-button" onClick={toggleGoogleAuth}>Sign in with Google</button>
        )}

        <p> <Link to="/forgot-password">  Forgot password? </Link>  or <Link to="/reset-password">  Reset Password </Link>  </p>

      <p> Don't have account! <Link to="/">  Create Account  </Link></p>


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

export default Login