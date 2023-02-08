const express = require("express");
const User = require("../../model/user").User;
const Category = require("../../model/category");
const Device = require("../../model/device");
const Notice = require("../../model/notice");
const Message = require("../../model/message");
const Room = require("../../model/room");
const utils = require("../../utils.js");

const router = express.Router();

require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let rooms = await Room.find({
      users: { $elemMatch: { uid: user_data.user.uid } },
    });
    return res.status(200).json({
      success: true,
      rooms: rooms,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
