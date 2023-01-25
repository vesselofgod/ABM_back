// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const Category = require("../../model/category");
const admin = require("../../config/notice.config");
const {JWT} = require("google-auth-library")
const router = express.Router();

require("dotenv").config();
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
var SCOPES = [MESSAGING_SCOPE];
function getAccessToken() {
  return new Promise(function(resolve, reject) {
    const key = require('../../config/abm-firebase.json');
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      console.log(tokens);
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}


router.get("/", async function (req, res, next) {

  let target_token = await getAccessToken();
  console.log(target_token);
  //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다
  let message = {
    data: {
      title: "테스트 데이터 발송",
      body: "데이터가 잘 가나요?",
      style: "good",
    },
    token: target_token,
  };

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log("Successfully sent message: : ", response);
    })
    .catch(function (err) {
      console.log("Error Sending message!!! : ", err);
    });
});

module.exports = router;
