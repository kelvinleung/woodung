const express = require("express");
const registerHandler = require("./register");
const loginHandler = require("./login");
const quizHandler = require("./quiz");
const authHandler = require("../middleware/auth");

const router = express.Router();

router.use("/register", registerHandler);
router.use("/login", loginHandler);
router.use("/quiz", authHandler, quizHandler);

module.exports = router;
