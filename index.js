const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const roomRouter = require("./routers/room.router");
const messageRouter = require("./routers/message.router");
const setAccessControl = require("./middlewares/setAccessControl");

app.use(cors());
app.use(express.json());
dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://dbUser:mylove@cluster0.iika6vi.mongodb.net/chat_app_test?retryWrites=true&w=majority",
  () => {
    console.log("connecting to db");
  }
);

app.use("/api/auth", setAccessControl, authRouter);
app.use("/api/users", setAccessControl, userRouter);
app.use("/api/rooms", setAccessControl, roomRouter);
app.use("/api/messages", setAccessControl, messageRouter);

app.listen(3000, () => {
  console.log("server running");
});
