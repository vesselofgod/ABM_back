const express = require("express");
const router = express.Router();
const readXlsxFile = require("read-excel-file/node");
const Region = require("../../model/region");
const dbConfig = require("../../config/db.config");
const User = require("../../model/user");
const { Console } = require("console");
const { json } = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;


router.get("/setRegion", async (req, res) => {
  readXlsxFile("city.xlsx").then(async (rows) => {
    for (let i = 0; i < rows.length; i++) {
      if (i !== 0) {
        region = new Region({
          region_code: rows[i][0],
          region: rows[i][1],
          district: rows[i][2],
        });
        await region.save((err, doc) => {
          if (err)
            console.log(err)
        });
      };
    }
  });
  readXlsxFile("city.xlsx");
});


router.get("/", async (req, res) => {
  try {
    let regions = await Region.find();
    let jsonData = {};
    for (let i = 0; i < regions.length; i++) {
      if (i !== 0) {
        if (!jsonData.hasOwnProperty(regions[i].region)) {
          jsonData[regions[i].region] = [];
        }
        jsonData[regions[i].region].push({
          label: regions[i].district,
          code: regions[i].region_code,
        });
      }
    }
    console.log(jsonData);
    return res.status(200).json({
      success: true,
      region_data: jsonData,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      err,
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

router.post("/setProfile", async (req, res) => {
  const { profileImg, nickname, description, hobby1, hobby2, hobby3, region } =
    req.body;

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

