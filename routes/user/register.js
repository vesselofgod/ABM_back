// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

router.post("/", async (req, res) => {
  const { uid, password, name, sex, birth, email } = req.body;

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
    });

    await user.save((err, doc) => {
      if (err)
        return res.status(400).json({
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
