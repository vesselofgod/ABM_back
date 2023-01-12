const express = require("express");
const Post = require("../../model/post");
const Image = require("../../model/image");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");

const router = express.Router();

router.get("/", (req, res) => {
  //Hello World 데이터 반환
  res.send("create page");
});

router.post("/", async (req, res) => {
  try {
    const { title, content, category, region, state, date, TO } = req.body;
    console.log(title, content, category, region, state, date, TO);
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    
    let post = new Post({
      title: title,
      content: content,
      author: user_data.user.nickname,
      category: category,
      region: region,
      state: state,
      date: date,
      TO: TO,
    });

    await post.save((err, doc) => {
      if (err)
        return res.status(400).json({
          success: false,
          err,
        });
      return res.status(200).json({
        success: true,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      err,
    });
  }
});

module.exports = router;
