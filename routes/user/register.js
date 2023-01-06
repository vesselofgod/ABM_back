// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Iamport = require("iamport-rest-client-nodejs");
const axios = require("axios");
require("dotenv").config();

router.get("/", (req, res) => {
  //Hello World 데이터 반환
  res.send("register page");
});

router.post("/checkUserIdExist", async (req, res) => {
  const uid = req.body.uid;
  let user = await User.findOne({ uid });
  if (user) {
    return res.status(400).json({
      errors: [{ msg: "User already exists" }],
      duplication: true,
    });
  }
  return res.status(200).json({
    duplication: false,
  });
});

router.post("/certification", async (req, res) => {
  /* 휴대폰 본인인증 정보 조회 */
  const { imp_uid } = req.body;

  try {
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IAMPORT_API_KEY, // REST API키
        imp_secret: process.env.IAMPORT_API_SECRET_KEY, // REST API Secret
      },
    });

    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 인증 정보 조회
    const getCertifications = await axios({
      url: "https://api.iamport.kr/certifications/" + imp_uid, // imp_uid 전달
      method: "get", // GET method
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    });

    const certificationsInfo = getCertifications.data.response; // 조회한 인증 정보
    User.findOne({ certificationKey: certificationsInfo.unique_key }).then(
      (user) => {
        if (!user) {
          return res.status(200).json({
            success: true,
            unique_key:certificationsInfo.unique_key,
          });
        } else {
          //unique key가 이미 있는 경우.-> 동일한 유저의 중복가입 방지
          return res.status(401).json({
            success: false,
            err: [{ msg: "User already signed up" }],
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      success: false,
      err: [{ msg: "User with incomplete certification" }],
    });
  }
});

router.post("/", async (req, res) => {
  const { uid, password, name, sex, birth, email, certificationKey } = req.body;

  try {
    // email을 비교해서 user가 이미 존재하는지 확인
    // 존재한다면 return해서 뒤의 코드를 실행하지 않음.
    let user = await User.findOne({ uid });
    if (user) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "User already exists" }],
      });
    }

    // user가 존재하지 않으면 새로운 user에 대해서 DB에 추가
    user = new User({
      uid,
      password,
      name,
      sex,
      birth,
      email,
      certificationKey,
    });

    await user.save((err, doc) => {
      if (err)
        return res.status(401).json({
          success: false,
          err,
        });
      return res.status(200).json({
        success: true,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
