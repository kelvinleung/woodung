const express = require("express");
const crypto = require("crypto");
const { User } = require("../models");
const Codes = require("../common/codes");

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res.json({ ...Codes.Register.USER_EXIST });
    } else {
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, "sha256")
        .toString("hex");
      await User.create({
        username,
        password: hashedPassword,
        salt,
      });
      return res.json({ ...Codes.Register.REGISTER_SUCCESS });
    }
  } catch (err) {
    console.log(err);
    return res.json({ ...Codes.Register.UNKNOWN_ERROR });
  }
});

module.exports = router;
