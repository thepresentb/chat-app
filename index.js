const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const roomRouter = require("./routers/room.router");
const messageRouter = require("./routers/message.router");
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
app.use(express.json());
dotenv.config();

// mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://dbUser:mylove@cluster0.iika6vi.mongodb.net/chat_app_test?retryWrites=true&w=majority",
  () => {
    console.log("connecting to db");
  }
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/messages", messageRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const listUserOnline = {};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  global.socket = socket;

  socket.on("joinRoom", ({ userId, roomIds }) => {
    io.emit("userOnline", userId);

    // khoi tao list user online
    listUserOnline[socket.id] = userId;

    roomIds.map((roomId) => {
      socket.join(roomId);
    });
  });

  socket.on("joinOneRoom", (userId, roomId) => {
    socket.join(roomId);
  });

  socket.on("userStatus", (data, callback) => {
    const resultData = [];
    for (let x in listUserOnline) {
      if (data.includes(listUserOnline[x]) && !resultData.includes(listUserOnline[x])) {
        resultData.push(listUserOnline[x]);
      }
    }
    callback(resultData);
  });

  // socket.on("add-user-to-room", ({ roomIds, userId }) => {
  //   roomIds.map((roomId) => {
  //     if (!listRoomOnline.includes(roomId)) {
  //       listRoomOnline.push(roomId);
  //     }
  //     const listUserId = onlineUsers.get(roomId);
  //     if (listUserId) {
  //       if (!listUserId.includes(socket.id)) {
  //         listUserId.push(socket.id);
  //       }
  //     } else {
  //       onlineUsers.set(roomId, [socket.id]);
  //     }
  //   });
  // });

  socket.on("sendMessage", (data) => {
    socket.to(data.room).emit("receiveMessage", data);
    // console.log("check onlineUsers", onlineUsers);
    // const listUserId = onlineUsers.get(data.room);
    // console.log("check lis ol", listUserId);
    // if (listUserId) {
    //   listUserId.map((userId) => {
    //     // sua socketid thanh user id
    //     socket.to(userId).emit("receiveMessage", data);
    //   });
    // }
  });

  socket.on("reloadContact", (roomId) => {
    io.emit("newContact", roomId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    const idUserOffline = listUserOnline[socket.id];
    io.emit("userOffline", idUserOffline);

    delete listUserOnline[socket.id];

    // listRoomOnline.map((roomOnline) => {
    //   const listUserId = onlineUsers.get(roomOnline);
    //   const index = listUserId.indexOf(socket.id);
    //   if (index !== -1) {
    //     listUserId.splice(index, 1);
    //   }
    // });
  });
});

server.listen(3000, () => {
  console.log("server running");
});
