import React,{useState, useEffect} from 'react';
import styled from "styled-components";
import axios from "axios";
import loader from "../asset/loading.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvtar } from "../utils/APIRoutes";

const Avatar = () => {
  const api = `https://api.multiavatar.com`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading]=useState(true);
  const [selectedAvtar, setSelectedAvtar]=useState(undefined);
  
   //setting the profile pic
  const setProfilePicture= async()=>{
    if (setSelectedAvtar === undefined) {
      toast.error("Please select an avatar");
    } else {
      const user = await JSON.parse(
        localStorage.getItem("REACT_APP_LOGIN_KEY")
      );
      const userId= user;
      const { data } = await axios.post(`${setAvtar}/${userId}`, {
        image: avatars[selectedAvtar],
      });
      if (data.isSet) {
        localStorage.setItem(
          "REACT_APP_LOGIN_KEY",
          JSON.stringify(user)
        );
        localStorage.setItem(
          "REACT_APP_USERNAME",
          JSON.stringify(avatars[selectedAvtar])
        );
        navigate("/ChatEntry");
      } else {
        toast.error("Error setting avatar. Please try again.");
      }
    }

   };


//fetching the avatar from multiavatar  
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 100)}`);         
          data.push(image.data);
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false); // Make sure to set loading state to false even in case of an error
      }
    };
    fetchData(); // Call the async function
  },[])


  return (
    <>
     {isLoading ? (
      <Container>
         <img src={loader} alt="loader" className="loader" />
      </Container>
     ):(

    

    <Container>
      <div className="title-container">
        <h1>
          Pick an avatar
        </h1>
      </div>
      <div className="avatars">
        {
           
          avatars.map((avatar, index) => (
            
            <div
              key={index}
              className={`avatar ${selectedAvtar === index ? "selected" : ""}`}
              onClick={() => setSelectedAvtar(index)}
            >
              <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 231 231"
               dangerouslySetInnerHTML={{ __html: avatar }}
              />
            </div>
          ))}

      </div>

      <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer/>
      </Container>
    )}
    </>
 
  )
}

export default Avatar

const Container = styled.div`
display: flex;
justify-content-center;
align-items:center;
flex-direction:column;
gap:3rem;
background-color:#98FB98;
height:100vh;
width:100vw;

.loader {
   max-inline-size: 100%; 
}
.title-container {
  h1{
    color: black
  }
}
.avatars {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
    align-items: center; /* Center avatars vertically */

  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    svg {
      height: 6rem;
      transition: 0.5s ease-in-out;
      
    }
  }
  .selected {
    border: 0.4rem solid #4e0eff;
  }
}

.submit-btn {
  background-color: #000000;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  &:hover {
    background-color: #000000;
    border: 4px solid White;
  }
  @media (max-width: 550px) {
    .avatars {
      flex-direction:row;
      gap: 1rem;
      align-items: center;
    }
}
`