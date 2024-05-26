const User = require("../model/userModel");
const ChatRoom = require('../model/chatRoom');
const ChatRoomMesseage = require('../model/chatRoomMesseges')
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');


const chatRoomIDCreation = async(req,res)=>{

    const {userId, newRoomId} = req.body;
    const roomId= newRoomId

    try{
        const roomid = await ChatRoom.findOne({ roomId });

    if(roomid){
        const currentTime = new Date();
        const createdAtTime = roomid.createdAt;
        const timeDifference = currentTime - createdAtTime;
        // Convert milliseconds to hours
        const hoursDifference = Math.abs(timeDifference) / 365;

        //if the roomId is created 24hrs back then you can delete the room id and create one if not you can send back any error 
        if (hoursDifference < 24) {
        return res.json({isSet: false, status: 409});
        }else{
            const deletedRoom = await ChatRoom.findOneAndDelete({ roomId });
            if(deletedRoom){
                const hashedPassword = await bcrypt.hash(userId, 10);
                const password = hashedPassword.substring(0, 12).replace(/[\/#]/g, '$');
                const chatroom = await ChatRoom.create({
                    roomId,
                    password,
                    userId: [userId],
                })
                return res.json({messege: " chat room created successfully",status: 200, isSet: true, password:password })
            }else{
                return res.json({error:" some error occured", status: 500 , isSet: false})
            }
        }
    }else{
        const hashedPassword = await bcrypt.hash(userId, 10);
        const password = hashedPassword.substring(0, 12);
        const chatroom = await ChatRoom.create({
            roomId,
            password,
            userId: [userId]
        })
        return res.json({messege: " chat room created successfully",status: 200, isSet: true, password:password })  
    }
    }catch(err){
        return res.json({error: "Some error occured", status: 500, isSet: false})
    }
    
}


const joinTheRoom = async(req,res)=>{

    const {roomId,password,userId} = req.params;
    try{
        const exsitRoomId = await ChatRoom.findOne({ roomId: roomId });
    if(exsitRoomId){
        //if the password is correct it should check if the people inside the chat box is already 2 or
        // not if less than 2 it will check the one who s already there is it the same id 
        //if not then it will add if already 2 people are there it will give error
        if(password === exsitRoomId.password){
            if(exsitRoomId.userId.length < 2){
                if(exsitRoomId.userId[0] !== userId){
                    const usersCount = exsitRoomId.usersCount +1;
                   await ChatRoom.findOneAndUpdate(
                    { roomId: roomId }, // Query condition
                    { 
                        $set: { usersCount: usersCount }, // Update usersCount
                        $push: { userId: { $each: [userId] } } // Add newUserId to userId array
                    }, 
                    { new: true } 
                      )
                      if(usersCount >2){
                        return res.json({isSet: false, status:451})
                      }
                      if(usersCount === 1)
                        {
                            await ChatRoom.findOneAndUpdate(
                                { roomId: roomId }, // Query condition
                                { userId: exsitRoomId.userId[0]}, // Update object
                                { new: true } // To return the updated document
                                ) 
                        }
                      return res.json({isSet: true, status:200})
                  } else{
                    return res.json({isSet: true, status:200})
                  }
            }else{
                if(exsitRoomId.userId[0] ==userId || exsitRoomId.userId[1] ==userId ){
                    return res.json({isSet: true, status:200})
                }else{
                    return res.json({isSet: false, status:451})
                }
            }
              
        }else{
            return res.json({isSet: false, status:401})
        }
    }else{
        return res.status(404).json({ msg: "Room Id is not there"})
    }
    }catch(err){
        return res.json({isSet: false, status:500})
    }
}


const addMessege= async(req,res)=>{
    try {
        const {roomId}= req.params;
        const{userID,message} = req.body;

        // Query the ChatRoom model to find the document with the specified roomId
        const chatRoom = await ChatRoom.findOne({ roomId });

        if (!chatRoom) {
            // Handle case where room with the specified roomId does not exist
            return res.json({msg:"Room ID doesn't exist ", status: 404});
        }

        // Retrieve the userId array from the document
        const userIds = chatRoom.userId;

        // Find the index of the userId that matches userIdFromBody
        const matchingIndex = userIds.findIndex(userId => userId === userID);

        if (matchingIndex === -1) {
            return res.json({ error: "User ID not found in the chat room", status: 402 });
        }

        // Filter out the userId that matches the userId from the frontend
        const otherUserIds = userIds.filter(userId => userId !== userID);
        
        if (otherUserIds.length === 0) {
            // Handle case where there are no other users in the chat room
            return res.json({msg: " No other ha been joined", status: 405});
        }


         // Assign the next userId to the 'to' variable
        const to = otherUserIds[0];
        
        // Select any one of the remaining userIds

        const from =userID;
        const otherUser = await User.findOne({ _id:from });
        const data = await ChatRoomMesseage.create({
            message: { text: message },
            users: [from, to],
            sender: from,
            roomId
          });
      
          if (data) {
            return res.json({ msg: "Message added successfully.", otherAvatar:otherUser.avatarImage });}

          else {
            return res.json({ msg: "Failed to add message to the database" });
        }      
    } catch (error) {
        // Handle error
        return null;
    }

}

const getMsg = async(req,res)=>{
    try{
        const {from,password} = req.body;
        const{chatRoomId}= req.params;
        const roomId = chatRoomId;
        // Query the ChatRoom model to find the document with the specified roomId
        const chatRoom = await ChatRoom.findOne({ roomId });

        if (!chatRoom) {
            // Handle case where room with the specified roomId does not exist
            return res.json({msg:"Room ID doesn't exist ", status: 404});
        }
        if(password !==chatRoom.password){
            return res.json({msg:"password doesn't match", status: 404});
        }

        // Retrieve the userId array from the document
        const userIds = chatRoom.userId;

        // Find the index of the userId that matches userIdFromBody
        const matchingIndex = userIds.findIndex(userId => userId === from);

        if (matchingIndex === -1) {
            return res.json({ error: "User ID not found in the chat room", status: 402 });
        }

        // Filter out the userId that matches the userId from the frontend
        const otherUserIds = userIds.filter(userId => userId !== from);

        
        if (otherUserIds.length === 0) {
            // Handle case where there are no other users in the chat room
            return res.json({msg: " No other has been joined", status: 405});
        }


         // Assign the next userId to the 'to' variable
        const to = otherUserIds[0];
        const SendingUser = await User.findOne({ _id:from });
        const receivingUser = await User.findOne({_id:to});

        //get all the msg that involves the 2 id's
        const messages = await ChatRoomMesseage.find({
            users: {
              $all: [from, to],
            },
            roomId: roomId,
          }).sort({ updatedAt: 1 });

           
          const projectedMessages = messages.map((msg) => {
            const isFromSelf = msg.sender.toString() === from;
            return {
              fromSelf: isFromSelf,
              message: msg.message.text,
              senderAvatar:isFromSelf ? SendingUser.avatarImage : receivingUser.avatarImage,
              time: new Date(msg.createdAt).getHours() +
                     ":" +
                    new Date(msg.createdAt).getMinutes(),
              author: isFromSelf ? SendingUser.name : receivingUser.name,

            };
          });
          res.json(projectedMessages);

    }catch(err){
        res.json("error occured")
    }

}

const logoutFromTHeRoom= async(req,res)=>{

    try{
    const {from} = req.body;
    const{chatRoomId}= req.params;
    const roomId = chatRoomId;
    // Query the ChatRoom model to find the document with the specified roomId
    const chatRoom = await ChatRoom.findOne({ roomId });

    if (!chatRoom) {
        return res.json({msg:"Room ID doesn't exist ", status: 404});
    }

    // Retrieve the userId array from the document
    const userIds = chatRoom.userId;

    // Find the index of the userId that matches userIdFromBody
    const matchingIndex = userIds.findIndex(userId => userId === from);

    if (matchingIndex === -1) {
        return res.json({ error: "User ID not found in the chat room", status: 402 });
    }

    // Filter out the userId that matches the userId from the frontend
    const otherUserIds = userIds.filter(userId => userId !== from);

    
    if (otherUserIds.length === 0) {
        // Handle case where there are no other users in the chat room
        return res.json({msg: " No other ha been joined", status: 405});
    }


     // Assign the next userId to the 'to' variable
    const to = otherUserIds[0];
    const deleteResult = await ChatRoomMesseage.deleteMany({
        users: {
          $all: [from, to],
        },
      });

    chatRoom.userId = otherUserIds;
    await chatRoom.save();

      res.json({msg: " logged out succefully", status: 200})

}catch(err){
    res.json({msg: " logged out was unsuccefully", status: 500})

}

}


const inviteFriend = async(req,res)=>{

    const {email, roomId} = req.body 
    const {userId}=req.params

    try{
        const chatRoom = await ChatRoom.findOne({ roomId });

        const user = await User.findOne({_id:userId});
        if(user){
            if(chatRoom){
                //if the use and chatroom exsit send the mail
                const token="abcd"
                const subject ="Invitation to join the chat room"
                const body=`<h3>Your Freind ${user.name}, has been inviting You to Join the chat,Please Join the chat Room through below link </h3>
                <a href="https://meet-chat-share-info.onrender.com/ChatEtry">Click here to join the room</a>
                <p> Room ID: ${roomId} </p>
                <p>Password: ${chatRoom.password}</p>
                <p> If You are new to the app please <a href="https://meet-chat-share-info.onrender.com"> Register here! </a> </p>`

                const pythonProcess = spawn('python', ['mailsender/mailsend.py', process.env.PASSWORDEMAIL, email, subject, body]);

                pythonProcess.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                    return res.json({
                        error: "error"
                    });
                });

                pythonProcess.on('close', (code) => {
                    //print what you want or send the response 
                });

                res.json({ message: 'Authentication successful, email sent.', status:"success" });

            }else{
                res.json({msg: "Room Id doesn't exsit", status: 401})
            }

        }else{
            res.json({msg: "User Doesn't exsit", status: 405})
        }

    }catch(error){
        res.json({msg: "User Doesn't exsit", status: 500})

    }
}
module.exports={chatRoomIDCreation, joinTheRoom, addMessege,getMsg,logoutFromTHeRoom,inviteFriend}
