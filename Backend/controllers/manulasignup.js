const User = require("../model/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');
console.log("coming to manual sign up controller");

const manualsignup = async(req,res)=>{

     try {
        // Extract name, email, and password from req.body
        const { name, emailId, password } = req.body;
        const email= emailId;


        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        const token = jwt.sign({name,password,email},process.env.JWT_VERIFICATION_KEY,{expiresIn :'20m'})

        if (!existingUser) {
        const subject ="Account Activation"
        const body=`<h3>Please click on the link to activate your account</h3>
        <a href="https://meet-chat-share-info.onrender.com/${token}">Activate Account</a>
        <p> link will get expire in 20min </p>`
        const pythonProcess = spawn('python', ['mailsender/mailsend.py', process.env.PASSWORDEMAIL, email, subject, body]);

        pythonProcess.stdout.on('data', (data) => {
            //print what you want or return what you want
        });

        pythonProcess.stderr.on('data', (data) => {
            return res.json({
                error: "error"
            });
        });

        pythonProcess.on('close', (code) => {
             //print what you want or return what you want
        });

        res.json({ message: 'Authentication successful, email sent.', status:"success" });
    
    }else {
      //If user already exists, send a 422 status code
      res.status(422).json({ error: 'Account already exists' });
   }

      } catch (error) {
        // Handle any errors
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  
}


const manualsignin = async(req,res)=>{
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Compare passwords
        const hashedPassword = await bcrypt.hash(password,10);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_MANUAL_LOGIN_KEY, { expiresIn: '1d' });
        res.status(200).json({ token: token, userID: user._id, userAvthar: user.avatarImage, userName: user.name }); // Send the token to the client
    } catch (error) {

        res.status(500).json({ error: 'Internal server error' });
    }

}


const registeringEmail = async(req,res)=>{

  const {token} = req.body;

  try{
    if(token){
      jwt.verify(token, process.env.JWT_VERIFICATION_KEY, async function(err,decoded){
         if(err){
          return res.status(400).json({error: "incorrect or expired token"})
         }
         const {name,password,email} = decoded
        
         const existingUser = await User.findOne({ email });
         
         const hashedPassword = await bcrypt.hash(password, 10);

         if (!existingUser) {
          const existingUser2 = await User.findOne({ email });

          if(!existingUser2){
            try{
              const user = await User.create({
                email,
                name,
                password: hashedPassword, // Save hashed password
                authSource: 'self'
              });
              res.status(200).json({ message: 'User created successfully', user });

            }catch(err){
              res.status(422).json({ error: 'Account already exists' });
            }
           
          }else{
            res.status(422).json({ error: 'Account already exists' });
          }
        }
        else {
          // If user already exists, send a 422 status code
          res.status(422).json({ error: 'Account already exists' });
        }

      } )
    }

  }catch(err){
    if (err) {
      if (err.code === 11000) { // Check if the error is due to duplicate key
        return res.status(422).json({ error: 'Email address is already registered' });
      }
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

module.exports={manualsignup, manualsignin,registeringEmail}