const User = require("../model/userModel");


const setAvatar = async(req,res)=>{

    try{
        //get the user Id and avtar Image ffrom the request body
        const userId = req.params.userId;
        const avatarImage = req.body.image;
        //wait and update the avatarImage and IsAvatarImageSet of user document
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
          });

    }catch(err){
        return res.status(500).json({error: "some error occured while setting the avatar"})
    }
}

module.exports={setAvatar}