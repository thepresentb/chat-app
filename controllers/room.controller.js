const { create, addUserToRoom, getData, searchRoomFromSv, removeUserFromRoom } = require("../servers/room.server");

const roomController = {
  createRoom: async (req, res) => {
    const newRoom = await create(req.body);
    return res.json(newRoom);
  },

  addUser: async (req, res) => {
    const { roomId, userId } = req.body;
    const updatedRoom = await addUserToRoom(roomId, userId);
    return res.json(updatedRoom);
  },

  getRoom: async (req, res) => {
    // const { idRoom } = req.body;
    const roomId = req.body.roomId;
    const limit = req.body?.limit;
    const room = await getData(roomId, limit);
    return res.json(room);
  },

  searchRoom: async (req, res) => {
    try {
      const listUserId = req.body.listUserId;
      const result = await searchRoomFromSv(listUserId);
      return res.json(result);
    } catch (err) {
      return res.json({ statusbar: "error", message: err.message });
    }
  },

  // getAllRooms: async (req, res) => {
  //   const { idUser} = req.params;
  //   const
  // },

  removeUser: async (req, res) => {
    const updatedRoom = await removeUserFromRoom(req.body);
    return res.json(updatedRoom);
  },
};

module.exports = roomController;
