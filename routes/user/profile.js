const express = require("express");
const router = express.Router();

const dbConfig = require("../../config/db.config");
const User = require("../../model/user");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

router.post("/checkUserNicknameExist", async (req, res) => {
  const nickname = req.body.nickname;
  let user = await User.findOne({ nickname });
  if (user) {
    return res.status(400).json({
      errors: [{ msg: "Nickname already exists" }],
      duplication: true,
    });
  }
  return res.status(200).json({
    duplication: false,
  });
});

router.post("/setProfile", async (req, res) => {
  const {
    profileImg,
    nickname,
    description,
    hobby1,
    hobby2,
    hobby3,
    region1,
    region2,
    region3,
  } = req.body;
  let isSuccess;
  if (isSuccess) {
    return res.status(200).json({
      success: true,
    });
  }
  return res.status(400).json({
    success: false,
  });
});

module.exports = router;
