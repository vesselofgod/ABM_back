const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
  device_token: {
    type: String,
  },
  uid: {
    type: String,
  },
  timestamp:{
    //일정 시간동안 timestamp가 업데이트되지 않았다면 device token을 다시 받음
    type: Date,
  },
});

// 데이터베이스 모델을 정의
const device = mongoose.model("device", deviceSchema);

module.exports = device;
