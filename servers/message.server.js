const { Room } = require("../models/Rooms.model");
const { User } = require("../models/Users.model");
const { Message } = require("../models/Messages.model");
const { SeenUser } = require("../models/SeenUsers.model");

const messageServer = {
  createData: async (data) => {
    try {
      const newMessage = new Message(data);
      const savedMessage = await newMessage.save();
      await SeenUser.findOneAndUpdate(
        {
          roomId: data.roomId,
        },
        {
          seenUserIds: data.userId,
        }
      );
      await Room.findOneAndUpdate(
        {
          _id: data.roomId,
        },
        {
          $push: { messagesIds: savedMessage._id },
          finalMessageId: savedMessage._id,
        }
      );
      return { statusbar: "success" };
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  getLastMessageOfRoom: async (data) => {
    try {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        const item = {
          roomId: "",
          roomMembers: [],
          finalMessage: {},
          seenUsers: [],
        };
        item.roomId = data[i];

        // choc vao room lay ten nguoi dung tung room
        const room = await Room.findById(data[i]);
        for (let j = 0; j < room.userIds.length; j++) {
          const user = await User.findById(room.userIds[j]);
          item.roomMembers.push({
            _id: user._id,
            username: user.username,
            avatarUrl: user.avatarUrl,
          });
        }

        // lay tin nhan cuoi cung trong moi room
        const finalMessage = await Message.findById(room.finalMessageId).populate({
          path: "userId",
        });
        item.finalMessage = {
          sender: finalMessage?.userId.username,
          content: finalMessage?.content,
          createAt: finalMessage?.createdAt,
        };

        // lay thong tin nguoi dung da xem
        const seenUser = await SeenUser.findOne({
          roomId: data[i],
        });
        for (let k = 0; k < seenUser.seenUserIds.length; k++) {
          const user = await User.findById(seenUser.seenUserIds[k]);
          // nen sua thanh push userId de front check
          item.seenUsers.push(user.username);
        }

        result.push(item);
      }
      return result;
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  addSeenUserData: async (data) => {
    try {
      const seenUser = await SeenUser.findOne({
        roomId: data.roomId,
      });
      if (seenUser && !seenUser.seenUserIds.includes(data.seenUserId)) {
        await seenUser.updateOne({
          $push: { seenUserIds: data.seenUserId },
        });
      } else {
        return { statusbar: "error" };
      }
      return { statusbar: "success" };
    } catch (err) {
      return { statusbar: "err", message: err };
    }
  },
  createSeenUserData: async (data) => {
    const newSeenUser = new SeenUser(data);
    await newSeenUser.save();
  },

  searchMessageFromSv: async (messageId) => {
    try {
      const query = Message.find();
      query.where({ _id: messageId }).near({ center: [3, 3] });
      query.exec((err, results) => {
        if (err) return err;
        console.log(results);
        return results;
      });
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },
};

module.exports = messageServer;
