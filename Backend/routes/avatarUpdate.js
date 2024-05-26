const express = require('express');
const routerAvatar = express.Router();
const routerAvatharController = require('../controllers/avatarUpdate');


routerAvatar.post('/avtar/:userId', routerAvatharController.setAvatar);

module.exports= routerAvatar
