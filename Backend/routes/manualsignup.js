const express = require('express');
const manualsignuprouter = express.Router();
const manulasignupcontoller = require('../controllers/manulasignup');


//routes for sign up, sign in and authenticate account
manualsignuprouter.post('/signup', manulasignupcontoller.manualsignup);
manualsignuprouter.post('/login', manulasignupcontoller.manualsignin);
manualsignuprouter.post('/authenticatingThroughEmail', manulasignupcontoller.registeringEmail);


module.exports= manualsignuprouter;