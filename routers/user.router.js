const { getUser, searchUsers, searchUser } = require("../controllers/user.controller");

const Router = require("express").Router();

Router.get("/searchList", searchUsers);
Router.get("/search", searchUser);
Router.get("/:id", getUser);

module.exports = Router;
