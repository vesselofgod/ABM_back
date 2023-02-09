const express = require("express");
const User = require("../../model/user").User;
const Category = require("../../model/category");
const Device = require("../../model/device");
const Notice = require("../../model/notice");
const admin = require("../../config/notice.config");
const { JWT } = require("google-auth-library");
const utils = require("../../utils.js");

const router = express.Router();

require("dotenv").config();
const MESSAGING_SCOPE = process.env.MESSAGING_SCOPE;
var SCOPES = [MESSAGING_SCOPE];

/*
TODO : notice쪽에서는 알림이 발생했을 경우에 user token 정보를 통해서 user가 지금 사용하고 있는 device token을
통해서 알림메시지를 보낸다.

알림메시지에 대해서도 발생 원인에 따라서 chat, match등으로 나뉘어야 하고, 메시지 form도 있으면 좋을 것 같다.
토큰 업데이트하는 API 추가
여러개의 토큰 알림 테스트
알림 읽었을 때 API 추가
*/

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = require("../../config/ourb-firebase.json");
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function (err, tokens) {
      console.log(tokens);
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

router.get("/", async (req, res) => {
  //각각의 유저에게 받은 알림을 제공하는 API
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let notices = await Notice.find({ uid: user_data.user.uid }).sort({ created: -1 });
    return res.status(200).json({
      success: true,
      notices: notices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

router.patch("/:notice_id", async (req, res) => {
  try {
    //채팅을 제외한 알림 읽음 처리하는 API
    const notice_id = req.params.notice_id;
    await Notice.updateOne(
      { _id: notice_id },
      { isread: true }
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
