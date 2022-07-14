const { Server } = require("socket.io");
const { randomBytes } = require("crypto");
const sessionMiddleware = require("../middlewares/session");
const SessionStore = require("../common/sessionStore");
const RoomStore = require("../common/roomStore");

const sessionStore = new SessionStore();
const roomStore = new RoomStore();

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

      // TODO: 处理 roomId 逻辑
      let roomId = roomStore.findRoomId(userId);
      if (!roomId) {
        roomId = randomBytes(4).toString("hex").toUpperCase();
        roomStore.saveRoom(roomId, userId);
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

      // 保存 session
      sessionStore.saveSession(socket.sessionId, {
        userId,
        username,
        role,
      });

      // 返回 session 信息
      socket.emit("session", {
        sessionId,
        username,
      });

      // 加入到 userId 的房间（方便直接发信息）
      socket.join(userId);

      // 加入房间
      socket.on("join_room", (roomId, callback) => {
        if (!roomStore.findTeacherId(roomId)) {
          callback({ code: 1000, message: "Room not found." });
          return;
        }
        socket.join(roomId);
        socket.roomId = roomId;
        socket
          .to(roomId)
          .emit("student_join_room", { id: userId, name: username });
        callback({ code: 0, message: "OK." });
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
