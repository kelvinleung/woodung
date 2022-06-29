const express = require("express");
const { User } = require("../db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const router = express.Router();

const TOKEN_EXPIRE_TIME = 600;

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.json({ message: "User or password incorrect" });
    } else {
      const salt = user.salt;
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, "sha256")
        .toString("hex");
      if (user.password === hashedPassword) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: TOKEN_EXPIRE_TIME,
        });
        return res.json({
          code: 0,
          message: "Login successfully",
          token,
        });
      } else {
        return res.json({ message: "User or password incorrect" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: "Unknown error" });
  }
});

module.exports = router;
