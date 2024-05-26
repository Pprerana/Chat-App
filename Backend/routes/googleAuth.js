
const express = require('express');
const routerGoogleAuth = express.Router();
const gogleAuthCotroller = require('../controllers/googleAuth');

//routes for sign in and sign up through google
routerGoogleAuth.post('/callback', gogleAuthCotroller.authenticatethroughGoogle);
routerGoogleAuth.post('/signin',gogleAuthCotroller.siginthroughGoogle);

module.exports= routerGoogleAuth;