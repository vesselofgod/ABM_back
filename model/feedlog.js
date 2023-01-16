// models/User.js
const mongoose = require("mongoose");
// mongoDB에 회원정보를 저장할 스키마를 regionSchema에 정의
const feedlogSchema = mongoose.Schema({
  fid: {
    type: Number,
  },
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
  images: {
    type: Array,
  },
});

// 데이터베이스 모델을 정의
const feedlog = mongoose.model("feedlog", feedlogSchema);

module.exports = feedlog;
