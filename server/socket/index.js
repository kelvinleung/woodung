const { Server } = require("socket.io");
const { randomBytes } = require("crypto");
const sessionMiddleware = require("../middlewares/session");
const dataStore = require("../common/sessionStore");

const configureSocket = (server) => {
  const io = new Server(server);

  io.use(sessionMiddleware);

  // 每当有新的连接就会执行
  io.on("connection", (socket) => {
    const { role, userId } = socket;

    // log
    console.log(`new connection: ${socket.id}`);

    // 断开连接
    socket.on("disconnect", () => {
      console.log(`disconect: ${socket.id}`);
      if (role === "student") {
        const roomId = socket.roomId;
        // 处理离开房间的逻辑
        socket.to(roomId).emit("student_leave_room", userId);
      }
    });

    // ------ 老师端
    if (role === "teacher") {
      const { userId } = socket;

      // 处理 roomId 逻辑
      let roomId = dataStore.findRoomId(userId);
      if (!roomId) {
        roomId = randomBytes(4).toString("hex").toUpperCase();
        dataStore.saveRoom(roomId, userId);
      }

      // 创建房间
      socket.join(roomId);

      socket.emit("room_info", roomId);

      // 出题
      socket.on("question", (question) => {
        socket.to(roomId).emit("new_question", question);
      });
    }

    // ------ 学生端
    if (role === "student") {
      const { sessionId, username } = socket;

      // 加入到 userId 的房间（方便直接发信息）
      socket.join(userId);

      // 加入房间
      socket.on("join_room", (roomId, callback) => {
        // 判断房间是否存在
        if (!dataStore.findTeacherId(roomId)) {
          callback({ code: 1000, message: "Room not found." });
          return;
        }

        // 加入房间
        socket.join(roomId);
        socket.roomId = roomId;

        // 保存 session
        dataStore.saveSession(socket.sessionId, {
          userId,
          username,
        });

        // 发送已加入房间消息
        socket
          .to(roomId)
          .emit("student_join_room", { id: userId, name: username });

        // 返回 sessionId
        callback({ code: 0, message: "OK.", data: { sessionId, username } });
      });

      // 答题
      socket.on("answer", ({ roomId, answer }) => {
        const { qid, aid } = answer;
        socket.to(roomId).emit("student_answer", { qid, aid, uid: userId });
      });
    }
  });
};

module.exports = configureSocket;
