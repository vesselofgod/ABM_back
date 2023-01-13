const express = require("express");
const Feed = require("../../model/feed");
const Feedlog = require("../../model/feedlog");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");
const upload = require("../../middleware/s3");

const router = express.Router();

router.put("/:fid", upload.array("images", 5), async (req, res) => {
  try {
    const {
      title,
      content,
      state,
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
    const fid = req.params.fid;

    const images = req.files ?? [];
    /*
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    */
    let feed = await Feed.findOne({ fid: fid });

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

    if (feed.date > new Date(date)) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Invalid date input." }],
      });
    }

    //이전의 기록들 log에 남기기(이미지는 array로 그냥 때려넣을 것)
    let feedlog = new Feedlog({
      fid: feed.fid,
      title: feed.title,
      content: feed.content,
      state: feed.state,
      category1: feed.category1,
      category2: feed.category2,
      category3: feed.category3,
      region1: feed.region1,
      region2: feed.region2,
      region3: feed.region3,
      date: feed.date,
      TO: feed.TO,
      regularity: feed.regularity,
    });
    //fid와 대조해서 image table 날리기
    let backup_images = await Image.find({ fid: fid });
    for (let i = 0; i < backup_images.length; i++) {
      feedlog.images.push(backup_images[i].URL);
    }

    await feedlog.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          success: false,
          error: [{ msg: "feed log backup failed" }],
        });
      }
    });

    //기존 이미지 테이블 지우기.
    await Image.deleteMany({ fid: fid });

    await Feed.updateOne(
      { fid: fid },
      {
        title: title,
        content: content,
        state: state,
        category1: category1,
        category2: category2,
        category3: category3,
        region1: region1,
        region2: region2,
        region3: region3,
        date: date,
        TO: TO,
        regularity: regularity,
      }
    );

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
