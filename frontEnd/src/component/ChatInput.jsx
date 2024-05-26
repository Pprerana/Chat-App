import React,{ useState} from 'react';
import Picker from "emoji-picker-react";

import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import styled from "styled-components";
const ChatInput = ({ handleSendMsg }) => {

    const [currentMessege, setCurrentMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //state to change when emoji is pressed  
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };


  //When send is pressed
  const sendMessage = async(event)=>{
        event.preventDefault();
        if(currentMessege.length > 0){
            handleSendMsg(currentMessege);
            setCurrentMessage('')
        } 
    }
    
    //When emoji is selected
    const handleEmojiClick = (event) => {
        let message = currentMessege;
        message += event.emoji;
        setCurrentMessage(message);
      };


  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendMessage(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setCurrentMessage(e.target.value)}
          value={currentMessege}
          onKeyDown={(event) => { 
            if (event.key === 'Enter') { 
            sendMessage(event); 
            } 
            }}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  )
}




const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
   
    position: relative; /* Ensure the container is relatively positioned */
     
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      z-index: 1;
      height: 28px;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .EmojiPickerReact {
        position: relative;
        top: -350px;  /* Position it below the emoji icon */
        left: 0; /* Align it with the left edge of the emoji icon */
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        max-width: 200px;
        max-height: 300px; /* Adjust the max-height value as needed */
        overflow-y: auto; 
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    position: relative; 
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
     
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      max-width: 90%; /* Adjust the maximum width as needed */
      word-wrap: break-word; /* Allow the text to wrap onto the next line */

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

export default ChatInput