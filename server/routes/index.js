const express = require("express");
const registerHandler = require("./register");
const loginHandler = require("./login");

const router = express.Router();

router.use("/register", registerHandler);
router.use("/login", loginHandler);

module.exports = router;
