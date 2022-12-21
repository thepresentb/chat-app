const { createRoom, addUser, getRoom, searchRoom, removeUser } = require("../controllers/room.controller");
const Router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken.middleware");

Router.post("/getRoom", getRoom);
// Router.get("/getRoom/:idUser", getAllRooms);
Router.post("/createRoom", verifyToken, createRoom);
Router.post("/searchRoom", searchRoom);
Router.post("/addUserToRoom", verifyToken, addUser);
Router.post("/removeUserToRoom", verifyToken, removeUser);

module.exports = Router;
