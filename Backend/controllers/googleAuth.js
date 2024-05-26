const User = require("../model/userModel");
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID)
const { spawn } = require('child_process');


const authenticatethroughGoogle = async (req,res)=>{

    try{
    console.log(req.body.credential)
    const credential=req.body.credential

    const client_id = req.body.clientId
        //verify the id token and client_id
    const ticket = await client.verifyIdToken({
        idToken : credential,
        audience : client_id,
        });

    const payload= ticket.getPayload()
    let {email_verified, name, email} = payload


    let user = await User.findOne({ email });
    console.log(user);

    if(user){
      return res.json({ message: 'User Already exsit', status: 422 });
    }

    let names = payload.given_name+ ' ' + payload.family_name
    let password = //encrypt as you need it

    name=names
    console.log(names)
    console.log(password)

    const token = jwt.sign({name,password,email},process.env.JWT_VERIFICATION_KEY,{expiresIn :'20m'})
    const subject ="Account Activation"
        const body=`<h3>Please click on the link to activate your account</h3>
        <a href="https://meet-chat-share-info.onrender.com/authorizing/${token}">Activate Account</a>
        <p> link will get expire in 20min </p>`
    const pythonProcess = spawn('python', ['mailsender/mailsend.py', process.env.PASSWORDEMAIL, email,  subject, body]);

        pythonProcess.stdout.on('data', (data) => {
       //print what you want or return hat you want
        });

        pythonProcess.stderr.on('data', (data) => {
            return res.json({
                error: "error"
            });
        });

        pythonProcess.on('close', (code) => {
            //print what you want or return hat you want
        });

        res.json({ message: 'Authentication successful, email sent.', status:"success" });
    }
    catch(err){
        return res.json({
            error: "error"
        });
    }
           
}


const siginthroughGoogle = async(req,res)=>{
    try{ 
        console.log(req.body.credential)
    const credential=req.body.credential

    const client_id = req.body.clientId
    //verify the id token and client_id
    const ticket = await client.verifyIdToken({
        idToken : credential,
        audience : client_id,
        });

    const payload= ticket.getPayload()
    let {email_verified, name, email} = payload


    let user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_MANUAL_LOGIN_KEY, { expiresIn: '1d' });
    if(user){
        console.log("sending the login information to the frontend")
        res.json({ token: token, userID: user._id, status:"success" , userAvthar: user.avatarImage, userName: user.name});
    } if (!user) {
        return res.json({ error: 'Invalid email or password', error: "error" });
    }
    }catch(err){
        console.log("catching the error: ", err)
        return res.json({ error: 'Invalid email or password', error: "error" });
    }

}

module.exports={authenticatethroughGoogle,siginthroughGoogle}