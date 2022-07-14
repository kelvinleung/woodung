const jwt = require("jsonwebtoken");

const authHandler = async (req, res, next) => {
  // 从 header 中取出 JWT
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ code: 4000, message: "Unauthorized" });
  }
  // 去掉头部字符 “Bearer "
  const token = authHeader.split(" ")[1];
  try {
    // 解析 JWT 得到 payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { exp } = payload;
    // 判断是否过期
    if (exp * 1000 <= Date.now()) {
      return res.json({ code: 4000, message: "Unauthorized" });
    }
    next();
  } catch (err) {
    res.json({ code: 4000, message: "Unauthorized" });
  }
};

module.exports = authHandler;
