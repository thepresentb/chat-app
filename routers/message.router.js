const {
  create,
  getLastMessages,
  addSeenUser,
  createSeenUser,
  searchMessage,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middlewares/verifyToken.middleware");

const Router = require("express").Router();

Router.post("/create", verifyToken, create);
Router.post("/searchMessage", verifyToken, searchMessage);
Router.get("/getLastMessage/:idUser", verifyToken, getLastMessages);
Router.post("/addSeenUser", verifyToken, addSeenUser);
Router.post("/createSeenUser", createSeenUser);

module.exports = Router;
