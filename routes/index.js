const express = require("express");

const router = express.Router()
const user =require("./user/index.js");
const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */
router.use("/user", user)

/**
 * @swagger
 * tags:
 *   name: register
 *   description: 유저 추가
 */
router.use("/register", register)

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 유저 token 인증
 */
router.use("/auth",auth)

/**
 * @swagger
 * tags:
 *   name: login
 *   description: 유저 로그인
 */
router.use("/login",login)
module.exports = router;
