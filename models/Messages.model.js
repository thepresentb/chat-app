const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
