const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`new connection: ${socket.id}`);

  // 断开连接
  socket.on("disconnect", () => {
    console.log(`disconect: ${socket.id}`);
  });

  // 创建房间
  socket.on("open-room", (roomId) => {
    socket.join(roomId);
  });

  // 加入房间
  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);
    socket.to(roomId).emit("student-join-room", { id: socket.id, name });
  });

  // 下一题
  socket.on("question", (question) => {
    socket.broadcast.emit("new-question", question);
  });

  // 答题
  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("student-answer", { ...answer, uid: socket.id });
  });
});

io.of("/").adapter.on("leave-room", (roomId, id) => {
  io.to(roomId).emit("student-leave-room", id);
});

server.listen(4399, () => console.log("running..."));
