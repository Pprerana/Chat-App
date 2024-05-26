import React,{useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {authentication} from '../utils/APIRoutes'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthenticationLoading() {
    const { token } = useParams();
    const [authorizationCompleted, setAuthorizationCompleted] = useState(false);
    const [apiCalled, setApiCalled] = useState(false);
    
    useEffect(() => {
      const authorizing = async () => {
        if (!apiCalled) {
          // Introduce a delay of 500 milliseconds before making the API call
          setTimeout(async () => {
            try {
              const response = await axios.post(`${authentication}`, { token });
              toast.success("Authorization completed. Please go to login page");
              setAuthorizationCompleted(true);
            } catch (err) {
              if (err.response) {
                const { status } = err.response;
                if (status === 500) {
                  // User already exists
                  toast.error('Something went wrong. Please try again!');
                }
              }
            } finally {
              setApiCalled(true);
            }
          }, 500);
        }
      };
  
      authorizing();
  
    }, [authorizationCompleted, apiCalled, token]);
  

  return (
    <div className="loading-container">
      {/* till the time authorize completes the loading gif will be running after that Login button will comechange iit accordingly you want */}
      {!authorizationCompleted?(<svg className="loading-spinner" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>):(<div> <a style={{fontSize: "@0px" }} href="/login"> Login </a> </div>)}
      <ToastContainer />
    </div>
  )
}

export default AuthenticationLoading