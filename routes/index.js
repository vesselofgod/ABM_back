const express = require("express");

const router = express.Router()
const user =require("./user/index.js");
const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");
const profile = require("./user/profile.js")

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
* paths:
*  /api/register:
*   get:
*     tags: [register]
*     summary: 회원가입 페이지
*     responses:
*       "200":
*         description: 회원가입 페이지 로드 성공
*   post:
*    summary: "회원가입 요청"
*    description: "PUT 방식을 통해 유저 수정(전체 데이터를 수정할 때 사용함)"
*    tags: [register]
*    requestBody:
*      description: 유저 수정
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            example:
*              {
*                 "uid":"abcd",
*                 "password":"efgh123!",
*                 "name":"qwer",
*                 "sex":"Male",
*                 "birth":"1999-04-03",
*                 "email":"abcd@gmail.com"
*              }
*            properties:
*              uid:
*                type: string
*                description: "유저 고유아이디"
*              password:
*                type: string
*                description: "유저 비밀번호"
*              name:
*                type: string
*                description: "유저 이름"
*              sex:
*                type: string
*                description: "유저 성별 : 남자:M 여자:F"
*              birth:
*                type: date
*                description: "유저의 생년월일"
*              email:
*                type: string
*                description: "유저 이메일"
*    responses:
*      "200":
*        description: 정상적으로 회원가입이 완료되었을 때.
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                success:
*                  type: boolean
*                  example: true
*      "400":
*        description: id가 중복되었을때
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                success:
*                  type: boolean
*                  example: false
*                error:
*                  type: object
*                  example: { msg: "User already exists" }
*      "500":
*        description: server error가 발생했을 때.
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                success:
*                  type: boolean
*                  example: false
*                error:
*                  type: object
*                  example: { msg: "TypeError: Cannot read properties of undefined" }
*
*/

/**
* @swagger
* paths:
*  /api/register/checkUserIdExist:
*   post:
*    summary: "유저 ID 중복확인요청"
*    description: "유저 ID 중복확인요청"
*    tags: [register]
*    requestBody:
*      description: "중복을 확인할 유저 ID "
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            example:
*              {
*                 "uid":"abcd",
*              }
*            properties:
*              uid:
*                type: string
*                description: "유저 고유아이디"
*    responses:
*      "200":
*        description: 정상적으로 회원가입이 완료되었을 때.
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                duplication:
*                  type: boolean
*                  example: false
*      "400":
*        description: id가 중복되었을때
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                duplication:
*                  type: boolean
*                  example: true
*                error:
*                  type: object
*                  example: { msg: "User already exists" }
*
 */
router.use("/register", register)

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 유저 token 인증
 * 
 */
router.use("/auth",auth)

/**
 * @swagger
 * tags:
 *   name: login
 *   description: 유저 로그인
 */
router.use("/login",login)

/**
 * @swagger
 * tags:
 *   name: profile
 *   description: 유저 로그인
 * paths:
*  /api/profile/checkUsernicknameExist:
*   post:
*    summary: "유저 닉네임 중복확인요청"
*    description: "유저 닉네임 중복확인요청"
*    tags: [profile]
*    requestBody:
*      description: "중복을 확인할 유저 닉네임 "
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            example:
*              {
*                 "nickname":"abcd",
*              }
*            properties:
*              nickname:
*                type: string
*                description: "유저 닉네임"
*    responses:
*      "200":
*        description: 닉네임이 중복되지 않았을 때
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                duplication:
*                  type: boolean
*                  example: false
*      "400":
*        description: 닉네임이 중복되었을때
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                duplication:
*                  type: boolean
*                  example: true
*                error:
*                  type: object
*                  example: { msg: "Nickname already exists" }
*
*/
router.use("/profile",profile)


module.exports = router;