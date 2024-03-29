const express = require("express");
const Feed = require("../../model/feed");
const Scrap = require("../../model/scrap");
const utils = require("../../utils.js");

const router = express.Router();

router.delete("/:fid", async (req, res) => {
  try {
    const fid = req.params.fid;
    await Feed.updateOne({ fid: fid }, { state: "Deleted" });
    await Scrap.deleteMany({ fid: fid });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      errors: [{ msg: "feed has not been deleted." }],
    });
  }
});

module.exports = router;
