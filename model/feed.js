// models/User.js
const mongoose = require("mongoose");

// mongoDB에 회원정보를 저장할 스키마를 regionSchema에 정의
const feedSchema = mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
  },
  content: {
    type: String,
    minlength: 30,
  },
  author: {
    type: String,
  },
  category1: {
    type: String,
  },
  category2: {
    type: String,
  },
  category3: {
    type: String,
  },
  region1: {
    type: String,
  },
  region2: {
    type: String,
  },
  region3: {
    type: String,
  },
  state: {
    //Recruiting : 모집중.
    //Closed : 모집 종료
    //Deleted : 삭제됨
    type: String,
    default: "Recruiting",
  },
  date: {
    type: Date,
  },
  TO: {
    type: Number,
  },
  regularity: {
    type: Boolean,
  },

});

// 데이터베이스 모델을 정의
const feed = mongoose.model("feed", feedSchema);

module.exports = feed;
