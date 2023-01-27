// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const Category = require("../../model/category");
const Device = require("../../model/device");
const admin = require("../../config/notice.config");
const { JWT } = require("google-auth-library");
const utils = require("../../utils.js");

const router = express.Router();

require("dotenv").config();
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
var SCOPES = [MESSAGING_SCOPE];

/*
TODO : notice쪽에서는 알림이 발생했을 경우에 user token 정보를 통해서 user가 지금 사용하고 있는 device token을
통해서 알림메시지를 보낸다.

알림메시지에 대해서도 발생 원인에 따라서 chat, match등으로 나뉘어야 하고, 메시지 form도 있으면 좋을 것 같다.
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

router.post("/", async function (req, res, next) {
  const token = req.header("authorization").split(" ")[1];
  const user_data = utils.parseJWTPayload(token);

  let device_tokens = await Device.find({ uid: user_data.user.uid });

  //console.log(device_tokens);
  //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다
  if (device_tokens.length == 0) {
    return res.status(401).json({
      success: false,
      err: "device token was not found.",
    });
  } else if (device_tokens.length == 1) {
    let message = {
      notification: {
        title: '테스트 발송',
        body: '앱 확인해보세요!',
      },
      data: {
        title: "테스트 데이터 발송",
        body: "데이터가 잘 가나요?",
        style: "good",
      },
      token: device_tokens[0],
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
        return res.status(200).json({
          success: true,
        });
      })
      .catch((error) => {
        console.log("Error sending message:", error);
        return res.status(400).json({
          success: false,
        });
      });

  } else {
    let message = {
      data: {
        title: "테스트 데이터 발송",
        body: "데이터가 잘 가나요?",
        style: "good",
      },
      token: device_tokens,
    };

    getMessaging()
      .sendMulticast(message)
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(registrationTokens[idx]);
            }
          });
          console.log("List of tokens that caused failures: " + failedTokens);
        }
      });
  }
});

module.exports = router;
