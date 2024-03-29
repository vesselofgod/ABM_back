const express = require("express");
const router = express.Router();

const Feed = require("../../model/feed");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const Match = require("../../model/match");
const utils = require("../../utils.js");
router.get("/", async (req, res) => {
  //메인화면에 필요한 정보를 제공함.
  //토큰 받아와서 유저 확인하고 지역, 관심 카테고리를 알게 된다면 이에 대한 정보를 쭉 뿌려주면 된다.
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    //feed의 region은 array라서 그 속에 이게 있는지 판별해야 함.
    //hobby와 categories는 둘 다 array라서 쿼리가 복잡할 수 있음.
    let interest_region_feeds = await Feed.find({
      regions: { $elemMatch: { region_code: user_data.user.interest_region } },
      state: "Recruiting",
    });

    let interest_hobby_feeds = await Feed.find({
      categories: {$in: user_data.user.hobbies},
      state: "Recruiting",
    });
    return res.status(200).json({
      success: true,
      region_feeds: interest_region_feeds,
      hobby_feeds: interest_hobby_feeds
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

router.get("/recruit", async (req, res) => {
  //모집화면에 필요한 정보를 제공함.
  //토큰 받아와서 유저 확인하고 지역, 관심 카테고리를 알게 된다면 이에 대한 정보를 쭉 뿌려주면 된다.
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let feeds = await Feed.find({
      author: user_data.user.nickname,
      state: "Recruiting",
    });

    return res.status(200).json({
      success: true,
      feedlist: feeds,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
});

router.get("/:feed_id", async (req, res) => {
  //각각의 게시판에 대한 상세한 정보를 제공함.
  //토큰 받아와서 유저 확인
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    const fid = req.params.feed_id;
    let isAuthor = false;
    let isScrapped = false;
    let matchStatus;
    let can_apply = true;

    let feed = await Feed.findOne({
      fid: fid,
      state: "Recruiting",
    });
    let scrap = await Scrap.findOne({
      fid: fid,
      user: user_data.user.nickname,
    });
    let match = await Match.findOne({
      fid: fid,
      app_user: user_data.user.nickname,
    });

    if (user_data.user.nickname == feed.author) isAuthor = true;
    if (scrap != null) isScrapped = true;
    if (match != null){
      matchStatus = match.accept;
      if (match.apply_cnt>1) can_apply = false;
    }

    const images = await Image.find({ fid: fid });
    return res.status(200).json({
      success: true,
      feed: feed,
      images: images,
      isAuthor: isAuthor,
      isScrapped: isScrapped,
      matchStatus: matchStatus,
      can_apply: can_apply,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
});

module.exports = router;
