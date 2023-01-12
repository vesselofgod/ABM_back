// models/User.js
const mongoose = require("mongoose");

// mongoDB에 회원정보를 저장할 스키마를 regionSchema에 정의
const scrapSchema = mongoose.Schema({
  uid: {
    type: String,
  },
  fid: {
    type: String,
  },
  isScrapped: {
    type: Boolean,
  },
});

// 데이터베이스 모델을 정의
const scrap = mongoose.model("scrap", scrapSchema);

module.exports = scrap;
