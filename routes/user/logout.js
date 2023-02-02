const express = require("express");
const Device = require("../../model/device");
const router = express.Router();
require("dotenv").config();
const utils = require("../../utils.js");

router.delete("/", async (req, res) => {
  try {
    const device_token = req.body.device_token;
    const token = req.header("authorization").split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    await Device.deleteOne({
      uid: user_data.user.uid,
      device_token: device_token,
    });
    res.status(200).send("Logout");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
