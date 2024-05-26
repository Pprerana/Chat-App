//keep the host in your .env file 

const hosting =process.env.REACT_APP_BACKEND_HOST
export const host=`https://${hosting}`
export const googlesignup= `${host}/auth`
export const manualsignup=`${host}/auth/signup`
export const loginmanual=`${host}/auth/login`
export const forgotEmail =`${host}/credential/Forgot-email`;
export const ressettingForgetPassword =`${host}/credential/resetting-forgot-email`
export const resetpassword = `${host}/credential/resetting-the-forgot-password`
export const setAvtar =`${host}/set/avtar`;
export const createRoomId = `${host}/chatroom/createchatroom`;
export const jointheRoom = `${host}/chatroom`;
export const sendMessageRoute = `${host}/chatroom`;
export const recieveMessageRoute = `${host}/chatroom/roomId`;
export const clearChatRoom=`${host}/chatRoom/ClearChatRoom`;
export const inviteAFriend=`${host}/chatRoom/InviteFriend`;
export const authentication= `${host}/auth/authenticatingThroughEmail`;