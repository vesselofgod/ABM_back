// models/User.js
const mongoose = require("mongoose");

// mongoDB에 게시글에 저장할 이미지 스키마를 imageSchema에 정의
const imageSchema = mongoose.Schema({
  fid: {
    type: Number,
  },
  URL: {
    type: String,
    required: true,
  },
});

// 데이터베이스 모델을 정의
const image = mongoose.model("image", imageSchema);

module.exports = image;
