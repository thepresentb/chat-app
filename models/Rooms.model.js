const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  userIds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],

  messagesIds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
  finalMessageId: {
    type: mongoose.Types.ObjectId,
    ref: "Message",
    defaultValue: null,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = { Room };
