const express = require("express");
const router = express.Router();

const Feed = require("../../model/feed");
const Match = require("../../model/match");
const User = require("../../model/user").User;
const Region = require("../../model/region").region;
const Notice = require("../../model/notice");
const Device = require("../../model/device");
const utils = require("../../utils.js");
const due = 3;

router.get("/application", async (req, res) => {
  //내가 신청한 모임에 대한 것을 관리하는 페이지
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    const status = req.query.status;
    let matches;

    await Match.updateMany(
      { due_date: { $lt: new Date() } },
      { accept: "Rejected" }
    );

    if (status == "Accepted") {
      matches = await Match.find({
        app_user: user_data.user.nickname,
        accept: "Accepted",
      });
    } else if (status == "Pending") {
      matches = await Match.find({
        app_user: user_data.user.nickname,
        accept: "Pending",
      });
    } else if (status == "Rejected") {
      matches = await Match.find({
        app_user: user_data.user.nickname,
        accept: "Rejected",
      });
    }

    let feeds = [];
    for (let i = 0; i < matches.length; i++) {
      let feed = await Feed.findOne({ fid: matches[i].fid });
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

router.get("/recruit/:fid", async (req, res) => {
  //내가 작성한 feed에 들어온 매칭 신청을 보여주는 페이지
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    const fid = req.params.fid;
    let matches = await Match.find({
      fid: fid,
      manager: user_data.user.nickname,
      accept: "Pending",
    });

    return res.status(200).json({
      success: true,
      applylist: matches,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
});

router.get("/recruit/:fid/:app_user", async (req, res) => {
  //신청자에 대한 프로필 정보를 보는 페이지
  try {
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    const app_user = req.params.app_user;
    const fid = req.params.fid;
    let status;

    let applicant = await User.findOne({
      nickname: app_user,
    });

    let region = await Region.findOne({
      region_code: applicant.interest_region,
    });

    let match = await Match.findOne({
      fid: fid,
      app_user: app_user,
    });

    if (match != null && match.accept == "Accepted") {
      status = "Accepted";
    } else if (match != null && match.accept == "Pending") {
      status = "Pending";
    } else if (match != null && match.accept == "Rejected") {
      status = "Rejected";
    } else {
      status = null;
    }
    if (applicant == null || match == null || region == null) {
      return res.status(401).json({
        success: false,
        error: "applicant not found",
      });
    }

    return res.status(200).json({
      success: true,
      applicant: applicant,
      region1: region.region,
      region2: region.district,
      status: status,
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
  //지원자가 match 신청을 하면 feed 작성자에게 푸시 알림이 가도록 설정
  try {
    let date = new Date();
    const fid = req.params.fid;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);

    let feed = await Feed.findOne({ fid: fid });
    let existmatch = await Match.find({
      fid: fid,
      app_user: user_data.user.nickname,
    });
    if (existmatch.length != 0) {
      if (existmatch.length > 1) {
        return res.status(401).json({
          success: false,
          err: "state error : Only one application can exist.",
        });
      } else if (existmatch[0].apply_cnt > 1) {
        return res.status(401).json({
          success: false,
          err: "re-apply only possible once.",
        });
      } else {
        await Match.updateOne(
          { fid: fid, app_user: user_data.user.nickname },
          {
            accept: "Pending",
            due_date: date.setDate(date.getDate() + due),
            apply_cnt: existmatch[0].apply_cnt + 1,
          }
        );

        let notice = new Notice({
          user: feed.author,
          title: "모임 매칭 신청이 들어왔습니다.",
          body: "매칭 신청화면에서 확인해주세요!",
          link: fid,
          type: "apply",
          created: new Date(),
        });
        let manager_info = await User.findOne({ nickname: feed.author });
        let device_tokens = await Device.find({ uid: manager_info.uid });
        let is_send = await utils.sendNotice(device_tokens, notice);

        if (!is_send) {
          return res.status(402).json({
            success: false,
            err: "Fail to sending notice message",
          });
        }

        await notice.save((err, doc) => {
          if (err)
            return res.status(400).json({
              success: false,
              err: "DB error",
            });
        });

        return res.status(200).json({ success: true });
      }
    } else {
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
          return res.status(400).json({
            success: false,
            err: "DB error",
          });
        }
        return res.status(200).json({
          success: true,
        });
      });
    }
    // 기존 매칭정보가 있는지 확인해야 함.
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
  //patch 신호가 오면 보낸 data의 link와 type을 토대로 알림 클릭 시 띄울 페이지를 결정함
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

    let notice = new Notice({
      user: app_user,
      title: "신청한 모임 매칭이 완료되었습니다.",
      body: "모임 게시글에서 결과를 확인해주세요!",
      link: fid,
      type: "match",
      created: new Date(),
    });
    let app_user_info = await User.findOne({ nickname: app_user });
    let device_tokens = await Device.find({ uid: app_user_info.uid });
    let is_send = await utils.sendNotice(device_tokens, notice);
    if (!is_send) {
      return res.status(402).json({
        success: false,
        err: "Fail to sending notice message",
      });
    }
    await notice.save((err, doc) => {
      if (err)
        return res.status(401).json({
          success: false,
          err,
        });
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      err,
    });
  }
});

module.exports = router;
