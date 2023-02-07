const mongoose = require("mongoose");
const userSchema = require("./user").userSchema;

const roomSchema = mongoose.Schema({
  room_id: {
    type: String,
  },
  title: {
    type: String,
  },
  fid: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.Mixed,
  },
  users: {
    type: Array,
  },
  block: {
    type: Array,
  },
});

// 데이터베이스 모델을 정의
const room = mongoose.model("room", roomSchema);

module.exports = room;
