// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user").User;
const Device = require("../../model/device");
const router = express.Router();
require("dotenv").config();
/*
TODO: 로그인 시에 device token을 받은 다음에 device table에 저장한다.
만약 해당 device token을 사용하고 있는 table이 발견된다면 그 테이블을 지우고 새로 table을 만든다.

*/
router.post("/", async (req, res) => {
  const { uid, password, device_token } = req.body;
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
      user.generateToken(async (err) => {
        if (err) return res.status(401).send(err);
        //토큰을 쿠키에 저장.
        let setProfile = null;
        if (!user.nickname) {
          setProfile = false;
        } else {
          setProfile = true;
        }

        await Device.deleteOne({
          device_token: device_token,
        });

        let device = new Device({
          device_token: device_token,
          uid: uid,
          //TODO : token 만료일 추가
        });

        await device.save((err, doc) => {
          if (err)
            return res.status(401).json({
              success: false,
              err: "device token was not stored.",
            });
        });

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
