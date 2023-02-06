const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: String,
  },
  created: {
    type: Date,
  },
  room_id: {
    type: String,
  },
});

// 데이터베이스 모델을 정의
const message = mongoose.model("message", messageSchema);

module.exports = message;
