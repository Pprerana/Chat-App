const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
email: {
required: true,
unique: true,
type: String,
},
name: {
required: true,
type: String
},
password: {
required: false,
type: String
},
authSource: {
    type: String,
    enum: ['self', 'google'],
    default: 'self'
  },
  resetLink:{
    type: String,
    default: ''
  },
  avatarImage: {
    type: String,
    default: "",
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },

});

module.exports = mongoose.model('user', userSchema);