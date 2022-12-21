const {
  createData,
  getLastMessageOfRoom,
  addSeenUserData,
  createSeenUserData,
  searchMessageFromSv,
} = require("../servers/message.server");
const { getListRoom } = require("../servers/user.server");

const messageController = {
  create: async (req, res) => {
    const newMessage = await createData(req.body);
    return res.json(newMessage);
  },

  getLastMessages: async (req, res) => {
    const idUser = req.params.idUser;
    const listRoom = await getListRoom(idUser);

    // convert to array
    const arr = listRoom.map((room) => room.valueOf());
    const listLastMessages = await getLastMessageOfRoom(arr);
    return res.json(listLastMessages);
  },

  addSeenUser: async (req, res) => {
    const result = await addSeenUserData(req.body);
    return res.json(result);
  },

  createSeenUser: async (req, res) => {
    await createSeenUserData(req.body);
    return res.json("success");
  },

  searchMessage: async (req, res) => {
    try {
      const messageId = req.query.messageId;
      console.log(messageId);
      const result = await searchMessageFromSv(messageId);
      return res.json(result);
    } catch (err) {}
    return res.json({ statusbar: "error", message: err });
  },
};

module.exports = messageController;
