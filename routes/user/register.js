// express 모듈 내의 Router를 이용해서 회원정보를 post 방식으로 요청 받으면 DB에 회원정보 저장
const express = require("express");
const User = require("../../model/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", (req, res) => {
    //Hello World 데이터 반환
    res.send("register page")
})


router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // email을 비교해서 user가 이미 존재하는지 확인
        // 존재한다면 return해서 뒤의 코드를 실행하지 않음.
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        };

        // user가 존재하지 않으면 새로운 user에 대해서 DB에 추가
        user = new User({
            name,
            email,
            password,
        });

        // bcrypt 모듈을 이용해 salt값을 부여하며 password 암호화
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 암호화된 내용까지 포함해 DB에 user를 저장.
        await user.save();

        const payload = { // json web token 으로 변환할 데이터 정보
            user: {
                id: user.id,
            },
        };
        // json web token 생성하여 send 해주기
        jwt.sign(
            payload, // 변환할 데이터
            process.env.JWT_SECRET_KEY, // secret key 값
            { expiresIn: "1h" }, // token의 유효시간
            (err, token) => {
                if (err) throw err;
                res.send({ token }); // token 값 response 해주기
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    };
});

module.exports = router;