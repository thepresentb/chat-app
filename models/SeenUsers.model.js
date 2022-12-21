const mongoose = require("mongoose");

const seenUserSchema = mongoose.Schema({
  roomId: {
    type: mongoose.Types.ObjectId,
    ref: "Room",
  },
  seenUserIds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const SeenUser = mongoose.model("SeenUser", seenUserSchema);

module.exports = { SeenUser };
