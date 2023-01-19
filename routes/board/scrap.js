const express = require("express");
const Feed = require("../../model/feed");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");

const router = express.Router();

router.get("/", async (req, res) => {
  //자신이 스크랩한 게시글을 보여주는 API
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let feeds = [];
    let scraps = await Scrap.find({ user: user_data.user.nickname });
    for (let i = 0; i < scraps.length; i++) {
      let feed = await Feed.findOne({ fid: scraps[i].fid });
      feeds.push(feed);
    }
    return res.status(200).json({
      success: true,
      scraplist: feeds,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      err,
    });
  }
});

router.post("/check/:fid", async (req, res) => {
  try {
    const fid = req.params.fid;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    let scrap = new Scrap({
      fid: fid,
      user: user_data.user.nickname,
    });

    await scrap.save(async (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
          error: [{ msg: "feed scrap failed!" }],
        });
      }

      return res.status(200).json({
        success: true,
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

router.delete("/uncheck/:fid", async (req, res) => {
  try {
    const fid = req.params.fid;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    let result = await Scrap.deleteOne({
      fid: fid,
      user: user_data.user.nickname,
    });

    if (result.deletedCount == 0) {
      return res.status(401).json({
        success: false,
        err: "it is unscraped feed or deleted feed",
      });
    }
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      err: "server error",
    });
  }
});

module.exports = router;
