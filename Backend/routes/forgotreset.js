const express = require('express');
const routerForgotreset = express.Router();
const forgotresetconroller = require("../controllers/forgotreset")

//routes for foretting and resseting the password
routerForgotreset.post('/Forgot-email', forgotresetconroller.forgotPassword);
routerForgotreset.put('/resetting-forgot-email', forgotresetconroller.resetforgotpassword);
routerForgotreset.put('/resetting-the-forgot-password', forgotresetconroller.resettheexsitingpassword);

module.exports=routerForgotreset