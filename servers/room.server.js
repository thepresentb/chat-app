const { Room } = require("../models/Rooms.model");
const { SeenUser } = require("../models/SeenUsers.model");
const { User } = require("../models/Users.model");

const roomServer = {
  create: async (data) => {
    try {
      const { listId } = data;
      const newRoom = new Room({
        userIds: listId,
      });
      const savedRoom = await newRoom.save();

      // tao danh sach nguoi dung da xem
      const newSeenUser = new SeenUser({ roomId: savedRoom._id });
      newSeenUser.save();

      listId.map(async (id) => {
        const user = User.findById(id);
        await user.updateOne({
          $push: { roomIds: savedRoom._id },
        });
      });
      const roomInfo = await Room.findById(savedRoom._id).populate({
        path: "userIds",
        select: ["_id", "username", "avatarUrl"],
      });
      return roomInfo;
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  addUserToRoom: async (roomId, userId) => {
    try {
      // const room = Room.findById(roomId);
      //  await room.updateOne({
      //   $push: { userIds: userId },
      // });
      await Room.updateOne(
        { _id: roomId },
        {
          $push: { userIds: userId },
        }
      );
      await User.updateOne(
        { _id: userId },
        {
          $push: { roomIds: roomId },
        }
      );
      return { statusbar: "success" };
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  getData: async (roomId, limit = 10) => {
    try {
      const room = await Room.findById(roomId).populate({
        path: "messagesIds",
        populate: { path: "userId", select: ["_id", "username", "avatarUrl"] },
        options: {
          limit: limit,
          sort: { createdAt: -1 },
        },
        select: ["_id", "userId", "roomId", "content"],
      });
      return room;
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  searchRoomFromSv: async (listUserId) => {
    try {
      const user = await User.findById(listUserId[0]);
      const listRoomId = user.roomIds;
      for (let i = 0; i < listRoomId.length; i++) {
        const room = await Room.findById(listRoomId[i]);
        if (room.userIds.length === 2 && room.userIds.includes(listUserId[1])) {
          const roomInfo = await Room.findById(listRoomId[i]).populate({
            path: "userIds",
            select: ["_id", "username", "avatarUrl"],
          });
          return roomInfo;
        }
      }
      const newRoom = await roomServer.create({ listId: listUserId });
      const roomInfo = await Room.findById(newRoom._id).populate({
        path: "userIds",
        select: ["_id", "username", "avatarUrl"],
      });
      return roomInfo;
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  removeUserFromRoom: async ({ roomId, userId }) => {
    // old syntax
    // const oldRoom = await Room.findById(roomId);
    // const newListUser = oldRoom.userIds.filter((userIdOld) => userIdOld.valueOf() !== userId);
    // const updatedRoom = await Room.findOneAndUpdate(
    //   {
    //     _id: roomId,
    //   },
    //   {
    //     userIds: newListUser,
    //   },
    //   {
    //     new: true,
    //   }
    // );
    // new syntax
    const updatedRoom = await Room.findOneAndUpdate(
      {
        _id: roomId,
      },
      {
        $pull: { userIds: userId },
      },
      {
        new: true,
      }
    );
    const user = User.findById(userId);
    console.log(user);
    await user.updateOne({
      $pull: { roomIds: updatedRoom._id },
    });
    return updatedRoom;
  },
};

module.exports = roomServer;
