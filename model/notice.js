const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema({
  user: {
    type: String,
  },
  title:{
    type: String,
  },
  body:{
    type: String,
  },
  isread:{
    type: Boolean,
    default: false,
  },
  link: {
    //이 정보를 어디서 받은건지 구분할 수 있는 필드가 있어야함.
    //match일 경우 fid를, chat일 경우 rid를 제공한다.
    type: String,
  },
  type: {
    //매치 성사 알림일 경우 type은 match,
    //매치 신청 알림의 경우 type은 apply,
    //채팅 알림일 경우 type은 chat
    type: String,
  }
});

const notice = mongoose.model("notice", noticeSchema);

module.exports = notice;
