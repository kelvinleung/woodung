const express = require("express");
const registerHandler = require("./register");
const loginHandler = require("./login");
const quizHandler = require("./quiz");
const authHandler = require("../middlewares/auth");
const roomHandler = require("./room");

const router = express.Router();

router.use("/register", registerHandler);
router.use("/login", loginHandler);
router.use("/quiz", authHandler, quizHandler);
router.use("/room", roomHandler);

module.exports = router;
