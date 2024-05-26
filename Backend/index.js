const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const db = require("./db/dbConnect");
const app= express();
require('dotenv').config();
const http= require('http');

//routes
const googleAuthRoute = require('./routes/googleAuth');
const manualsignup = require('./routes/manualsignup');
const forgotresetPassword = require('./routes/forgotreset');
const avatarsetUp = require('./routes/avatarUpdate');
const chatRoom = require('./routes/chatRoom');
const {Server}= require('socket.io')
app.use(cors());
app.use(express.json())

db()

app.use('/auth/google', googleAuthRoute);
app.use('/auth', manualsignup);
app.use('/credential',forgotresetPassword);
app.use('/set', avatarsetUp);
app.use('/chatroom',chatRoom);


const server = app.listen(process.env.PORT,()=>{
  console.log(`listining to ${process.env.port}`)
});


//socket connection
const io= new Server(server,{
    cors:{
        origin:"",                           //origin you want to allow
        method:["GET", "POST", "PUT"],
    },
   });

  global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    console.log(`user connected: ${socket.id}`)
    global.chatSocket = socket;

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
      
    //when from socket msg sends it will send the recieved msg back to the front end
      socket.on("send_message", (data) => {
        if (data && data.room) {
          console.log(data)
            socket.to(data.room).emit("receive_message", data);
            console.log("Message sent to room:", data.room);
          } else {
            console.error("Invalid message data:", data);
          }
      });
    
    socket.on("disconnect",()=>{
        console.log("User Disconnected: ", socket.id)
    })
})

