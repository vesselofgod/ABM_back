const express = require("express");
const Feed = require("../../model/feed");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");
const upload = require("../../middleware/s3");
const Category = require("../../model/category");
const Region = require("../../model/region").region;

const router = express.Router();

router.get("/", (req, res) => {
  //Hello World 데이터 반환
  res.send("create page");
});

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { title, content, categories, regions, date, TO, regularity } =
      req.body;
    const images = req.files ?? [];
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    //썸네일 설정
    let thumbnail;
    if (images.length == 0) {
      //이미지가 없는 경우
      thumbnail = await Category.findOne({ category_code: categories[0] });
      thumbnail = thumbnail.default_img;
    } else {
      thumbnail = images[0].location;
    }

    const categoryset = new Set(categories);
    const regionset = new Set(regions);
    if (categories.length != categoryset.size) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Selected categories are duplicated." }],
      });
    }

    if (regions.length != regionset.size) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Selected regions are duplicated." }],
      });
    }

    let regionData = [];

    for (let i = 0; i < regions.length; i++) {
      let reg = await Region.findOne({ region_code: regions[i] });
      let jsonData = {
        region: reg.region,
        district: reg.district,
        region_code: reg.region_code,
      };
      regionData.push(jsonData)
    }

    let feed = new Feed({
      title: title,
      content: content,
      author: user_data.user.nickname,
      categories: categories,
      regions: regionData,
      date: date,
      TO: TO,
      regularity: regularity,
      thumbnail: thumbnail,
    });

    await feed.save(async (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
          error: [{ msg: "feed upload failed!" }],
        });
      }

      for (let i = 0; i < images.length; i++) {
        let image = new Image({
          fid: feed.fid,
          URL: images[i].location,
        });
        await image.save((err, doc) => {
          if (err)
            return res.status(401).json({
              success: false,
              error: [{ msg: "image upload failed!" }],
            });
        });
      }

      return res.status(200).json({
        success: true,
        fid: feed.fid,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      err,
    });
  }
});

module.exports = router;
