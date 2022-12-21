const { create, getUser } = require("../servers/user.server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, avatarUrl } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const result = await create({
        username: username,
        email: email,
        password: hash,
        avatarUrl: avatarUrl,
      });
      return res.json(result);
    } catch (err) {
      return res.json({ statusbar: "error", message: "please try again" });
    }
  },

  login: async (req, res) => {
    try {
      const reqInfo = req.body;
      const userInfo = await getUser({ username: reqInfo.username });
      if (!userInfo) {
        return res.json({
          statusbar: "error",
          message: "username or password are incorrect",
        });
      }
      const isAuthenticated = await bcrypt.compare(reqInfo.password, userInfo.password);
      if (!isAuthenticated) {
        return res.json({
          statusbar: "error",
          message: "username or password are incorrect",
        });
      }
      const accessToken = await jwt.sign({ username: userInfo.username }, "present", {
        expiresIn: "1h",
      });
      const { password, ...others } = userInfo._doc;
      const result = { ...others, accessToken };
      return res.json(result);
    } catch (err) {
      return res.json({ statusbar: "error", message: "please try again" });
    }
  },
};

module.exports = authController;
