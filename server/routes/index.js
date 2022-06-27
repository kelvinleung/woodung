const express = require("express");
const registerHandler = require("./register");

const router = express.Router();
router.use("/register", registerHandler);

module.exports = router;
