// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", (req, res) => {
  //Hello World 데이터 반환
  res.send("login page");
});

router.post("/", async (req, res) => {
  const { uid, password } = req.body;
  try {
    // id를 비교해서 user가 이미 존재하는지 확인
    // 존재한다면 return해서 뒤의 코드를 실행하지 않음.
    let user = await User.findOne({ uid: uid });

    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        message: "login failed",
      });
    }

    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch)
        return res.status(400).json({
          loginSuccess: false,
          message: "login failed",
        });
      //matched, token generation.

      //토큰 생성하는 부분에서 에러 발생
      user.generateToken((err) => {
        if (err) return res.status(401).send(err);
        //토큰을 쿠키에 저장.
        let setProfile = null;
        if (!user.nickname) {
          setProfile = false;
        } else {
          setProfile = true;
        }
        res.cookie("x_auth_token", user.token).status(200).json({
          loginSuccess: true,
          token: user.token,
          setProfile: setProfile,
        });
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
