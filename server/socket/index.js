const { Server } = require("socket.io");

const configureSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`new connection: ${socket.id}`);

    // 断开连接
    socket.on("disconnect", () => {
      console.log(`disconect: ${socket.id}`);
    });

    // ------ 老师端

    // 创建房间
    socket.on("open-room", (roomId) => {
      socket.join(roomId);
    });

    // 出题
    socket.on("question", (question) => {
      socket.broadcast.emit("new-question", question);
    });

    // ------ 学生端

    // 加入房间
    socket.on("join-room", ({ roomId, name }) => {
      socket.join(roomId);
      socket.to(roomId).emit("student-join-room", { id: socket.id, name });
    });

    // 答题
    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("student-answer", { ...answer, uid: socket.id });
    });
  });

  io.of("/").adapter.on("leave-room", (roomId, id) => {
    io.to(roomId).emit("student-leave-room", id);
  });
};

module.exports = configureSocket;
