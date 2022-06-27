const express = require("express");
const { User } = require("../db");
const crypto = require("crypto");

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res.json({ message: "User already registered" });
    } else {
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, "sha256")
        .toString("hex");
      const newUser = await User.create({
        username,
        password: hashedPassword,
        salt,
      });
      if (newUser) {
        return res.json({ message: "Registered successfully" });
      } else {
        return res.json({ message: "Could not register" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: "Unknown error" });
  }
});

module.exports = router;
