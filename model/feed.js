const mongoose = require("mongoose");
const autoIdSetter = require("./auto_increment.js");
// mongoDB에 회원정보를 저장할 스키마를 regionSchema에 정의
const feedSchema = mongoose.Schema({
  fid: {
    type: Number,
  },
  title: {
    type: String,
    minlength: 5,
    text: true,
  },
  content: {
    type: String,
    minlength: 30,
    text: true,
  },
  author: {
    type: String,
    text: true,
  },
  categories: {
    type: Array,
  },
  regions: {
    type: Array,
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
  thumbnail: {
    type: String,
  },
});

autoIdSetter(feedSchema, mongoose, "feed", "fid");

// 데이터베이스 모델을 정의
const feed = mongoose.model("feed", feedSchema);

module.exports = feed;
