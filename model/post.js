// models/User.js
const mongoose = require("mongoose");

// mongoDB에 회원정보를 저장할 스키마를 regionSchema에 정의
const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    minlength: 20,
  },
  author: {
    type: String,
  },
  category: {
    type: Array,
  },
  region: {
    type: String,
  },
  state: {
    type: String,
  },
  date: {
    type: Date,
  },
  TO: {
    type: Number,
  },
});

// 데이터베이스 모델을 정의
const post = mongoose.model("post", postSchema);

module.exports = post;
