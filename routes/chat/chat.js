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
    //유저가 속한 채팅방 list를 제공하는 API
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

router.get("/:room_id", async (req, res) => {
  //채팅방 입장 시에 메시지 로그를 얻을 수 있는 API
  try {
    const room_id = req.params.room_id;
    let chats = await Message.find({ room_id: room_id }).sort({ created: 1 });
    return res.status(200).json({
      success: true,
      chats: chats,
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
