const { User } = require("../models/Users.model");

const userServer = {
  create: async (data) => {
    try {
      const newUser = new User(data);
      await newUser.save();
      return { statusbar: "success" };
    } catch (err) {
      const error = Object.keys(err.errors || err.keyValue);
      console.log(error);
      let errMsg;
      switch (error[0]) {
        case "avatarUrl":
          errMsg = "Please chose a avatar";
          break;
        default:
          errMsg = `${error[0]} is already exist`;
      }
      return { statusbar: "error", message: errMsg };
    }
  },

  getUser: async ({ username }) => {
    try {
      const userData = await User.findOne({ username: username });
      if (userData) return userData;
    } catch {
      return null;
    }
  },

  getListRoom: async (userId) => {
    const user = await User.findById(userId);
    return user.roomIds;
  },

  getData: async (userId) => {
    try {
      const userData = await User.findById(userId).select(["_id", "username", "avatarUrl", "roomIds"]);
      if (userData) return userData;
    } catch {
      // neu co loi return statusbar error
      return null;
    }
  },

  getListSearchedUsers: async (username) => {
    try {
      const listUserSearches = await User.find({ username: { $regex: username, $options: "i" } })
        .limit(5)
        .select(["_id", "username", "avatarUrl", "roomIds"]);
      return listUserSearches;
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },

  getSearchedUser: async (username) => {
    try {
      const userSearched = await User.findOne({ username: username }).select(["_id", "username", "avatarUrl"]);
      // .populate({
      //   select: ["_id", "username", "avatarUrl"],
      // });
      return userSearched;
    } catch (err) {
      return { statusbar: "error", message: err };
    }
  },
};

module.exports = userServer;
