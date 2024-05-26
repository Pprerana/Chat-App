const User = require("../model/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');


const forgotPassword = async (req,res) =>{
   const {email} = req.body;
   try{
    const user = await User.findOne({ email });
    // If user doesn't exist, return an error response
    if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }
      // Generate the token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_FORGOT_EMAIL, { expiresIn: '20m' });

    // Update the resetLink field in the User model
    await User.findOneAndUpdate({ email }, { resetLink: token });

    // Send the email with the reset link
    const subject = "Password Reset Request";
    const body = `
      <h3>Please click on the link to reset your password</h3>
      <a href="${process.env.PASSWORD_RESET_LINK}/${token}">${process.env.PASSWORD_RESET_LINK}/${token}</a>
      <p>Remember link will get expire in 20mins </p>
    `;

    const pythonProcess = spawn('python', ['mailsender/mailsend.py',process.env.PASSWORDEMAIL, email, process.env.PASSWORD_RESET_LINK, token, subject, body]);

    
    pythonProcess.stdout.on('data', (data) => {
  //print what you want or send the reponse as per you want
  });

  pythonProcess.stderr.on('data', (data) => {
      return res.sttaus(400).json({
          error: "error"
      });
  });

  pythonProcess.on('close', (code) => {
//print what you want or send the reponse as per you want
  });

  res.status(200).json({ message: ' Email sent successfully', status:"success" });
   }catch(err){
       if(err){
        return res.status(500).json({messege:"some error occured"})
       }
   }
}


const resetforgotpassword = async (req,res)=>{
      const {password, email, token} = req.body
      try{
        if(token){
            const verifyToken = jwt.verify(token, process.env.JWT_FORGOT_EMAIL)


            if(!verifyToken){
                return res.status(401).json({error: "incorrect token or expired"})
            }
            const resetLink =token;
            const VerifyResetLink=  await User.findOne({resetLink})

            if(!VerifyResetLink){
               return res.status(403).json({error: "user with this token id doesn't exist"})
            }
            if(VerifyResetLink.email === email){
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.findOneAndUpdate(
                  { email },
                  { password: hashedPassword },
                  { new: true } // Return the updated document
                );
                return res.status(200).json({messege: " Password updated"})
            }
          }else{
            return res.status(400).json({messege: "Token has not sent"})
          }
      }catch(err){
         return res.status(500).json({error: "something went wrong"})
      }     
}

const resettheexsitingpassword = async(req,res)=>{

        const {email,password,newPassword } = req.body

        try{
            const resetthepassword=  await User.findOne({email})
            if(resetthepassword){
                const isPasswordValid = await bcrypt.compare(password, resetthepassword.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await User.findOneAndUpdate(
                  { email },
                  { password: hashedPassword },
                  { new: true } // Return the updated document
                );
                return res.status(200).json({messege: " Password updated"})
            }else{
                return res.status(401).json({error: "user not found"})
            }
        }catch(error){
            return res.status(500).json({error : "some error occured"})
        }

}



module.exports={forgotPassword, resetforgotpassword, resettheexsitingpassword}