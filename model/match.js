// models/User.js
const mongoose = require("mongoose");

// mongoDB에 게시글에 저장할 이미지 스키마를 imageSchema에 정의
const matchSchema = mongoose.Schema({
  app_user: {
    type: String,
  },
  manager: {
    type: String,
  },
  fid: {
    type: Number,
  },
  due_date: {
    type: Date,
  },
  accept: {
    //수락된 경우 : Accepted
    //거절된 경우 : Rejected
    //대기중인 경우 : Pending
    type: String,
  },
  apply_cnt: {
    type: Number,
    default: 1,
  },
});

// 데이터베이스 모델을 정의
const match = mongoose.model("match", matchSchema);

module.exports = match;
