const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    await jwt.verify(accessToken, "present", function (err, decoded) {
      if (err) {
        return res.status(403).send("token is invalid");
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(403).send("you are not authenticated");
  }
};

module.exports = { verifyToken };
