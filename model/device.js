// models/User.js
const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
  device_token: {
    type: String,
  },
  uid: {
    type: String,
  },
  tokenExp:{
    type: Date,
  }
});

// 데이터베이스 모델을 정의
const device = mongoose.model("device", deviceSchema);

module.exports = device;
