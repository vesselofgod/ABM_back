const express = require("express");
const router = express.Router();
const Region = require("../../model/region").region;
const getRegions = require("../../model/region").getRegions;

const dbConfig = require("../../config/db.config");
const User = require("../../model/user");
const upload = require("../../middleware/s3");
const utils = require("../../utils.js");
const city = require("../../city.json");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

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
    const { nickname, description, hobby1, hobby2, hobby3, region } = req.body;
    const profileImg = req.file;
    const token = req.header("authorization").split(" ")[1];

    if (hobby1 == hobby2 || hobby1 == hobby3 || hobby2 == hobby3) {
      const empty_cnt = [hobby1, hobby2, hobby3].reduce(
        (cnt, item) => (item ? cnt : cnt + 1),
        0
      );

      if (empty_cnt < 2) {
        return res.status(401).json({
          success: false,
          errors: [{ msg: "Selected hobbies are duplicated." }],
        });
      }
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
        hobby1: hobby1,
        hobby2: hobby2,
        hobby3: hobby3,
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

module.exports = router;
