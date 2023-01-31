const express = require("express");
const router = express.Router();
const Region = require("../../model/region").region;
const getRegions = require("../../model/region").getRegions;
const bcrypt = require("bcrypt");

const dbConfig = require("../../config/db.config");
const User = require("../../model/user");
const upload = require("../../middleware/s3");
const utils = require("../../utils.js");

const city = require("../../data/city.json");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const saltRounds = 10;

router.get("/setRegion", async (req, res) => {
  try {
    await Promise.all(
      city.map((item) => {
        const region = new Region(item);
        return region.save((err, doc) => {
          if (err) throw err;
        });
      })
    );
    console.log("region data inserted.");

    return res.status(201).json({
      message: "region data inserted.",
    });
  } catch (error) {
    console.log(error);
    return res.status(406).json({
      message: error,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    let regions = await getRegions();
    return res.status(200).json({
      success: true,
      region_data: regions,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: err }],
    });
  }
});

router.post("/checkUserNicknameExist", async (req, res) => {
  const nickname = req.body.nickname;
  let user = await User.findOne({ nickname: nickname });
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

router.post("/setProfile", upload.single("image"), async (req, res, next) => {
  try {
    const { nickname, description, hobbies, region } = req.body;
    const profileImg = req.file;
    const token = req.header("authorization").split(" ")[1];
    const hobbiesset = new Set(hobbies);
    if (hobbies.length != hobbiesset.size) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Selected hobbies are duplicated." }],
      });
    }

    // token parsing
    const user_data = utils.parseJWTPayload(token);
    const user_key = user_data.user._id;
    await User.updateOne(
      { _id: user_key },
      {
        nickname: nickname,
        description: description,
        profileImg: profileImg.location,
        hobbies: hobbies,
        interest_region: region,
      }
    );

    const user = await User.findOne({ _id: user_key });

    user.generateToken((err) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.status(200).json({
          success: true,
          token: user.token,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [{ msg: error }],
    });
  }
});

router.patch("/changeProfile", upload.single("image"), async (req, res) => {
  //일단 기획안에서 프로필 수정 시 변경가능한 정보만 수정
  try {
    const { description, hobbies, region, name, sex, birth, email, imgURL } =
      req.body;
    const profileImg = req.file;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    const hobbiesset = new Set(hobbies);
    if (hobbies.length != hobbiesset.size) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Selected hobbies are duplicated." }],
      });
    }
    if (imgURL) {
      await User.updateOne(
        { _id: user_data.user._id },
        {
          description: description,
          hobbies: hobbies,
          interest_region: region,
          name: name,
          sex: sex,
          birth: birth,
          email: email,
        }
      );
    } else {
      await User.updateOne(
        { _id: user_data.user._id },
        {
          description: description,
          hobbies: hobbies,
          interest_region: region,
          profileImg: profileImg.location,
          name: name,
          sex: sex,
          birth: birth,
          email: email,
        }
      );
    }

    const user = await User.findOne({ _id: user_data.user._id });

    user.generateToken((err) => {
      if (err) {
        console.log(err)
        return res.status(400).send(err);
      } else {
        return res.status(200).json({
          success: true,
          token: user.token,
        });
      }
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      errors: [{ msg: err }],
    });
  }
});

router.patch("/changePassword", async (req, res) => {
  //비밀번호 변경 API
  //기존 비밀번호를 확인하고 새로운 비밀번호를 암호화하여 저장함.
  try {
    const { old_password, new_password } = req.body;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    const password = await bcrypt.hash(new_password, saltRounds);

    let user = await User.findOne({ uid: user_data.user.uid });
    var check = await bcrypt.compare(old_password, user.password);
    if (!check)
      return res.status(401).json({
        success: false,
        error: "password is incorrect",
      });
    await User.updateOne({ uid: user_data.user.uid }, { password: password });
    user.generateToken((err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
          error: "Fail to new token generation",
        });
      } else {
        return res.status(200).json({
          success: true,
          token: user.token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errors: "Server error occur",
    });
  }
});

module.exports = router;
