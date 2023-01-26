const express = require("express");
const Feed = require("../../model/feed");
const Feedlog = require("../../model/feedlog");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");
const upload = require("../../middleware/s3");
const Category = require("../../model/category");
const e = require("express");
const Region = require("../../model/region").region;

const router = express.Router();

router.put("/:fid", upload.array("images", 5), async (req, res) => {
  try {
    const {
      title,
      content,
      state,
      categories,
      regions,
      date,
      TO,
      regularity,
      imgURL,
    } = req.body;
    const fid = req.params.fid;

    const images = req.files ?? [];

    /*
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    */

    let thumbnail;
    if (images.length == 0) {
      //이미지가 없는 경우
      //이것도 url 링크도 없는 경우에만 실행해야 한다.
      if (imgURL.length == 0) {
        thumbnail = await Category.findOne({ category_code: categories[0] });
        thumbnail = thumbnail.default_img;
      } else {
        thumbnail = imgURL[0];
      }
    } else {
      thumbnail = images[0].location;
    }

    let feed = await Feed.findOne({ fid: fid });

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
      regionData.push(jsonData);
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
      categories: feed.categories,
      regions: feed.regions,
      date: feed.date,
      TO: feed.TO,
      regularity: feed.regularity,
      thumbnail: feed.thumbnail,
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
    //이미지 url로 날라올 경우 이미지를 유지한다.
    //이미지를 서치하고 있으면 그대로 쓰고 없으면 그냥 날림. 쿼리 하나만 추가하면 될 거 같음.
    //기존 이미지 테이블 지우기.
    console.log(imgURL);
    let result = await Image.deleteMany({ fid: fid, URL: { $nin: imgURL } });
    console.log(result);
    await Feed.updateOne(
      { fid: fid },
      {
        title: title,
        content: content,
        state: state,
        categories: categories,
        regions: regionData,
        date: date,
        TO: TO,
        regularity: regularity,
        thumbnail: thumbnail,
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
