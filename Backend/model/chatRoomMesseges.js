const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);