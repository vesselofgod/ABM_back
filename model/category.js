// models/User.js
const mongoose = require("mongoose");

// mongoDB에 게시글에 저장할 이미지 스키마를 imageSchema에 정의
const categorySchema = mongoose.Schema({
  category_code: {
    type: String,
  },
  default_img: {
    type: String,
  },
});

// 데이터베이스 모델을 정의
const category = mongoose.model("category", categorySchema);

module.exports = category;
