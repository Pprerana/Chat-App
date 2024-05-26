const mongoose = require('mongoose');
const { Schema } = mongoose;


const chatRoomSchema = new Schema({
    roomId: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 4
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    usersCount: {
      type: Number,
      default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
    userId: Array,
  });
  
  module.exports = mongoose.model('ChatRoom', chatRoomSchema);