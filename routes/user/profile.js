const express = require("express");
const router = express.Router();
const readXlsxFile = require("read-excel-file/node");
const Region = require("../../model/region").region;
const getRegions = require("../../model/region").getRegions;
const dbConfig = require("../../config/db.config");
const User = require("../../model/user");
const upload = require("../../middleware/s3");
const { Console } = require("console");
const { json } = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

router.get("/setRegion", async (req, res) => {
  readXlsxFile("city.xlsx").then(async (rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (i !== 0) {
        let region = new Region({
          region_code: rows[i][0],
          region: rows[i][1],
          district: rows[i][2],
        });
        await region.save((err, doc) => {
          if (err) console.log(err);
        });
      }
    }
  });
  readXlsxFile("city.xlsx");
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

router.post("/setProfile", upload.single("image"), async (req, res, next) => {
  try {
    const { uid, nickname, description, hobby1, hobby2, hobby3, region } =
      req.body;
    const profileImg = req.file;

    if (hobby1 == hobby2 || hobby1 == hobby3 || hobby2 == hobby3) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Selected hobbies are duplicated." }],
      });
    }

    await User.updateOne(
      { uid: uid },
      {
        nickname: nickname,
        description: description,
        profileImg: profileImg.location,
        hobby1: hobby1,
        hobby2: hobby2,
        hobby3: hobby3,
        region: region,
      }
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: [{ msg: error }],
    });
  }
});

module.exports = router;
