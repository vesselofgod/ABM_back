const express = require("express");

const router = express.Router();
const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");
const profile = require("./user/profile.js");
const createpage = require("./board/create.js");
const readpage = require("./board/read.js");
const deletepage = require("./board/delete.js");
const updatepage = require("./board/update.js");

router.use("/register", register);
router.use("/auth", auth);
router.use("/login", login);
router.use("/profile", profile);
router.use("/create", createpage);
router.use("/read", readpage);
router.use("/delete", deletepage);
router.use("/update", updatepage);

//need to change
const uploadController = require("./user/upload");
router.use("/upload", uploadController.uploadFiles);
router.use("/files", uploadController.getListFiles);
router.use("/files:name", uploadController.download);



module.exports = router;
