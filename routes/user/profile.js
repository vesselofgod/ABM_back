const express = require("express");
const router = express.Router();
const getRegions = require("../../model/region").getRegions;
const bcrypt = require("bcrypt");
const User = require("../../model/user").User;
const upload = require("../../middleware/s3");
const utils = require("../../utils.js");

const saltRounds = 10;

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
  try {
    const { description, hobbies, region, name, sex, birth, email } = req.body;
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

    await User.updateOne(
      { _id: user_data.user._id },
      {
        description: description,
        hobbies: hobbies,
        interest_region: region,
        profileImg: profileImg?.location,
        name: name,
        sex: sex,
        birth: birth,
        email: email,
      }
    );

    const user = await User.findOne({ _id: user_data.user._id });

    user.generateToken((err) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      } else {
        return res.status(200).json({
          success: true,
          token: user.token,
        });
      }
    });
  } catch (err) {
    console.log(err);
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
    const { uid, old_password, new_password } = req.body;
    const password = await bcrypt.hash(new_password, saltRounds);

    let user = await User.findOne({ uid: uid });
    var check = await bcrypt.compare(old_password, user.password);
    if (!check)
      return res.status(401).json({
        success: false,
        error: "password is incorrect",
      });
    await User.updateOne({ uid: uid }, { password: password });
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
