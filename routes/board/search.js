const express = require("express");
const router = express.Router();
const Feed = require("../../model/feed");

router.get("/:keyword", async (req, res) => {
  //키워드가 제목, 내용에 포함된 feed들을 제공하는 API
  try {
    const keyword = req.params.keyword;
    let result = await Feed.find({$text: {$search: keyword}});
    console.log(result)
    return res.status(200).json({
      success: true,
      searchlist: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
