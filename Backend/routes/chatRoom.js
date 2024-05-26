const express = require('express');
const routerChatroom= express.Router();
const chatroomconroller = require("../controllers/chatRoom");

//routes for chat room activity
routerChatroom.post('/createchatroom',chatroomconroller.chatRoomIDCreation);
routerChatroom.get('/:roomId/:password/:userId',chatroomconroller.joinTheRoom);
routerChatroom.post('/:roomId',chatroomconroller.addMessege);
routerChatroom.post('/roomId/:chatRoomId', chatroomconroller.getMsg);
routerChatroom.post('/ClearChatRoom/:chatRoomId', chatroomconroller.logoutFromTHeRoom);
routerChatroom.post('/InviteFriend/:userId', chatroomconroller.inviteFriend)
module.exports=routerChatroom