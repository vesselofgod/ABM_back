const express = require("express");
const router = express.Router();

const Feed = require("../../model/feed");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const Match = require("../../model/match");
const utils = require("../../utils.js");
const due = 3;

router.get("/application", async (req, res) => {
  //내가 신청한 모임에 대한 것을 관리하는 페이지
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let matches = await Match.find({ app_user: user_data.user.nickname });
    let feeds = [];
    for (let i = 0; i < matches.length; i++) {
      let feed = await Feed.find({ fid: matches[i].fid });
      feeds.push(feed);
    }
    return res.status(200).json({
      success: true,
      feedlist: feeds,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
});

router.post("/application/:fid", async (req, res) => {
  //match 신청 넣는 API
  try {
    let date = new Date();
    const fid = req.params.fid;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    let feed = await Feed.findOne({ fid: fid });

    let match = new Match({
      app_user: user_data.user.nickname,
      manager: feed.author,
      fid: fid,
      due_date: date.setDate(date.getDate() + due),
      accept: "Pending",
    });

    await match.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          success: false,
          err,
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
      error: err,
    });
  }
});

router.patch("/recruit/:fid/:app_user", async (req, res) => {
  //match 수락/거절 API
  //req.params.uid를 통해서 신청자의 id를 확인하고, 자신에게 보낸 match 신청을 수락 or 거절함.
  //그런데 아마 uid하고 fid가 둘 다 필요할 거 같은데 parameter로 받지 말고 req.body로 받아야하나...
  //토큰 받아서 자기가 작성자인지 확인해야하나...
  try {
    const fid = req.params.fid;
    const app_user = req.params.app_user;
    const accept = req.body.accept;

    let result = await Match.updateOne(
      { fid: fid, app_user: app_user },
      { accept: accept }
    );

    if (result.matchedCount == 0)
      return res.status(400).json({
        success: false,
        err: "Match does not found.",
      });
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
