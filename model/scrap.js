// models/User.js
const mongoose = require("mongoose");

const scrapSchema = mongoose.Schema({
  user: {
    type: String,
  },
  fid: {
    type: Number,
  },
});

// 데이터베이스 모델을 정의
const scrap = mongoose.model("scrap", scrapSchema);

module.exports = scrap;
