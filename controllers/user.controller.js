const { getData, getListSearchedUsers, getSearchedUser } = require("../servers/user.server");

const userController = {
  getUser: async (req, res) => {
    const id = req.params.id;
    const user = await getData(id);
    return res.json(user);
  },

  searchUsers: async (req, res) => {
    const username = req.query.username;
    const listUsers = await getListSearchedUsers(username);
    return res.json(listUsers);
  },

  searchUser: async (req, res) => {
    const username = req.query.username;
    const listUsers = await getSearchedUser(username);
    return res.json(listUsers);
  },
};

module.exports = userController;
