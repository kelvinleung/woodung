const express = require("express");
const { User } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Codes = require("../common/codes");

const router = express.Router();

const TOKEN_EXPIRE_TIME = 60 * 60 * 24;

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.json({ ...Codes.Login.USER_PASSWORD_INCORRECT });
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
          ...Codes.Login.LOGIN_SUCCESS,
          data: { token },
        });
      } else {
        return res.json({ ...Codes.Login.USER_PASSWORD_INCORRECT });
      }
    }
  } catch (err) {
    console.log(err.message);
    return res.json({ message: "Unknown error" });
  }
});

module.exports = router;
