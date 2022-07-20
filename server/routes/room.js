const express = require("express");
const dataStore = require("../common/dataStore");
const Codes = require("../common/codes");

const router = express.Router();

router.get("/", async (req, res) => {
  const { roomId } = req.query;
  const isValid = dataStore.isRoomValid(roomId);
  if (isValid) {
    return res.json({ ...Codes.Room.GET_ROOM_BY_ID_SUCCESS });
  }
  res.json({ ...Codes.Room.GET_ROOM_BY_ID_NOT_FOUND });
});

module.exports = router;
