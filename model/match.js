// models/User.js
const mongoose = require("mongoose");

// mongoDB에 게시글에 저장할 이미지 스키마를 imageSchema에 정의
const matchSchema = mongoose.Schema({
  applicant_id: {
    type: String,
  },
  manager_id: {
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
  can_reapply: {
    type: Boolean,
  },
});

// 데이터베이스 모델을 정의
const match = mongoose.model("match", matchSchema);

module.exports = match;
