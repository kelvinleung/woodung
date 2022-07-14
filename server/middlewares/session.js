const { randomUUID } = require("crypto");

const sessionMiddleware = (socket, next) => {
  // 判断用户角色
  const role = socket.handshake.auth.role;

  if (role === "teacher") {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Invalid userId."));
    }
    socket.userId = userId;
    socket.role = role;
    next();
  } else {
    const sessionId = socket.handshake.auth.sessionId;
    // “老”用户
    if (sessionId) {
      const session = sessionStore.findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        socket.username = session.username;
        socket.role = session.role;
        return next();
      }
    }
    // “新”用户
    const { username } = socket.handshake.auth;
    // teacher 没有 username
    if (role === "student" && !username) {
      return next(new Error("Invalid username."));
    }
    socket.sessionId = randomUUID();
    socket.userId = randomUUID();
    socket.username = username;
    socket.role = role;
    next();
  }
};

module.exports = sessionMiddleware;
