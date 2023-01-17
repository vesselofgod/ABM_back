const express = require("express");

const router = express.Router();
const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");
const profile = require("./user/profile.js");
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
 */
/**
 * @swagger
 * paths:
 *  /api/register/certification:
 *   post:
 *    summary: "휴대전화로 유저 본인확인"
 *    description: "휴대전화로 유저 본인확인"
 *    tags: [register]
 *    requestBody:
 *      description: "인증시 발생하는 imp_uid를 통해서 유저의 인증상태를 확인"
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              {
 *                 "imp_uid":"imp_891638747369",
 *              }
 *            properties:
 *              imp_uid:
 *                type: string
 *                description: "인증 시 발생하는 uid로, 이를 통해서 유저의 인증상태를 확인할 수 있다."
 *    responses:
 *      "200":
 *        description: 정상적으로 유저인증 완료되었을 때.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                unique_key:
 *                  type: string
 *                  example: 'l0o4Lpwo/Yi9POjpb1w3O3tdfWGF'
 *      "400":
 *        description: 인증이 완료되지 않은 경우
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
 *                  example: { msg: "User with incomplete certification" }
 *      "401":
 *        description: unique key가 이미 있는 경우 -> 동일한 유저의 중복가입 방지
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
 *                  example: { msg: "User already signed up" }
 *
 */

router.use("/register", register);

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 유저 token 인증
 *
 */
router.use("/auth", auth);

router.use("/login", login);

/**
 * @swagger
 * tags:
 *   name: profile
 *   description: 유저 프로필 설정
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

/**
 * @swagger
 * tags:
 *   name: profile
 *   description: 유저 프로필 설정 정보 제공
 * paths:
 *  /api/profile:
 *   get:
 *     tags: [profile]
 *     summary: 프로필 설정 페이지에 필요한 정보 제공
 *     responses:
 *      "200":
 *        description: 프로필 설정에 필요한 정보를 성공적으로 제공함
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                region_data:
 *                  type: object
 *                  example: "{서울특별시:[{label:송파구,code:1171000000},{label:관악구,code:1162000000}],부산광역시:[{label:영도구,code:2620000000},{label:동구,code:2617000000},{label:중구,code:2611000000},{label:연제구,code:2647000000},{label:사하구,code:2638000000}],대구광역시:[{label:북구,code:2723000000},{label:달서구,code:2729000000}]}"
 *      "400":
 *        description: 에러가 발생한 경우
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
 *                  example: { msg: "error" }
 */

/**
 * @swagger
 * tags:
 *   name: profile
 *   description: 유저 프로필 설정
 * paths:
 *  /api/profile/setProfile:
 *   post:
 *    summary: "유저 프로필 설정 API"
 *    description: "토큰을 통해 유저를 검색하고, 유저의 프로필 설정을 위해 필요한 정보를 받아온 후, 이미지는 S3에 저장하여 URL로, 나머지는 String으로 DB에 저장한다. 그 후 변경된 정보에 대한 토큰 정보와 성공여부를 반환한다."
 *    tags: [profile]
 *    requestBody:
 *      description: " 유저 프로필 설정을 위한 정보를 multipart/form-data로 받아온다. "
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              nickname:
 *                type: string
 *                description: "유저 닉네임"
 *              description:
 *                type: string
 *                description: "자기소개글"
 *              profileImg:
 *                type: file
 *                description: "프로필 사진"
 *              interest_region:
 *                type: string
 *                description: "관심 지역 코드"
 *              hobby1:
 *                type: string
 *                description: "관심분야1"
 *              hobby2:
 *                type: string
 *                description: "관심분야2"
 *              hobby3:
 *                type: string
 *                description: "관심분야3"
 *    responses:
 *      "200":
 *        description: 프로필 설정이 성공적으로 완료되었을때
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                token:
 *                  type: string
 *                  example: eyJhbGciOiJIUfsafJ9.NjNiY2QwYmUwfsafjQyNmE2ZjQ0YTc5.Mu7K58qtGBIq0r3aAotTmmMba65uDoRRpg3nVqe1qVw
 *      "400":
 *        description: req로 받은 값을 DB에 저장하는 과정에서 에러가 발생한 경우
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
 *                  example: { msg: error code}
 *
 *      "401":
 *        description: 관심분야를 중복 설정한 경우
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
 *                  example: { msg: "Selected hobbies are duplicated." }
 */

router.use("/profile", profile);

const uploadController = require("./user/upload");
router.use("/upload", uploadController.uploadFiles);
router.use("/files", uploadController.getListFiles);
router.use("/files:name", uploadController.download);

const createpage = require("./board/create.js");
const readpage = require("./board/read.js");
const deletepage = require("./board/delete.js");
const updatepage = require("./board/update.js");

router.use("/create", createpage);
router.use("/read", readpage);
router.use("/delete", deletepage);
router.use("/update", updatepage);

module.exports = router;
