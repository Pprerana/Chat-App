import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import {googlesignup} from '../utils/APIRoutes'

function GoogleOauth({ isSignup, handleResponse }) {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENTID;
    const endpoint = isSignup ?  'google/signup':  'google/signin' ; //select the endoint based  on is it signup or sign in
    const onsuccessLogin =(credentialResponse)=>{
        axios.post(`${googlesignup}/${endpoint}`, credentialResponse)
        .then(response => {
            // Add any additional logic here
            if(response.data.status=== 'success'){
              handleResponse('success', response.data);
            }
            if(response.data.status===422){
              handleResponse(422, response.data);
            }
        })
        .catch(error => {
            handleResponse('error', error);
        });
        
    }
  return ( 
    <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
        onSuccess={credentialResponse => {
            onsuccessLogin(credentialResponse)
            }}
            onError={(error) => {
              //handle the error here
            }
            }>

        </GoogleLogin>
    </GoogleOAuthProvider>
  )
}

export default GoogleOauth