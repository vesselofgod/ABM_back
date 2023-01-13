const express = require("express");
const Feed = require("../../model/feed");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");
const upload = require("../../middleware/s3");
const Category = require("../../model/category");

const router = express.Router();

router.get("/", (req, res) => {
  //Hello World 데이터 반환
  res.send("create page");
});

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const {
      title,
      content,
      category1,
      category2,
      category3,
      region1,
      region2,
      region3,
      date,
      TO,
      regularity,
    } = req.body;
    const images = req.files ?? [];
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    //썸네일 설정
    let thumbnail;
    if (images.length == 0) {
      //이미지가 없는 경우
      if (category1) {
        thumbnail = await Category.findOne({ category_code: category1 });
        thumbnail = thumbnail.default_img;
      } else if (category2) {
        thumbnail = await Category.findOne({ category_code: category2 });
        thumbnail = thumbnail.default_img;
      } else if (category3) {
        thumbnail = await Category.findOne({ category_code: category3 });
        thumbnail = thumbnail.default_img;
      } else {
        return res.status(401).json({
          success: false,
          error: [{ msg: "category not selected" }],
        });
      }
    } else {
      thumbnail = images[0].location;
    }

    if (
      category1 == undefined &&
      category2 == undefined &&
      category3 == undefined
    )
      return res.status(402).json({
        success: false,
        error: [{ msg: "Please input categories" }],
      });

    if (region1 == undefined && region2 == undefined && region3 == undefined)
      return res.status(402).json({
        success: false,
        error: [{ msg: "Please input regions" }],
      });

    if (region1 == region3 || region1 == region2 || region2 == region3) {
      const empty_cnt = [region1, region2, region3].reduce(
        (cnt, item) => (item ? cnt : cnt + 1),
        0
      );

      if (empty_cnt < 2) {
        return res.status(401).json({
          success: false,
          errors: [{ msg: "Selected regions are duplicated." }],
        });
      }
    }

    if (
      category1 == category2 ||
      category2 == category3 ||
      category1 == category3
    ) {
      const empty_cnt = [category1, category2, category3].reduce(
        (cnt, item) => (item ? cnt : cnt + 1),
        0
      );

      if (empty_cnt < 2) {
        return res.status(401).json({
          success: false,
          errors: [{ msg: "Selected categories are duplicated." }],
        });
      }
    }

    let feed = new Feed({
      title: title,
      content: content,
      author: user_data.user.nickname,
      category1: category1,
      category2: category2,
      category3: category3,
      region1: region1,
      region2: region2,
      region3: region3,
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
