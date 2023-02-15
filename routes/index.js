const express = require("express");

const router = express.Router();
const register = require("./user/register.js");
const auth = require("./user/auth.js");
const login = require("./user/login.js");
const logout = require("./user/logout.js")
const profile = require("./user/profile.js");
const createpage = require("./board/create.js");
const readpage = require("./board/read.js");
const deletepage = require("./board/delete.js");
const updatepage = require("./board/update.js");
const match = require("./board/match.js");
const scrap = require("./board/scrap.js");
const notice = require("./user/notice.js");
const chat = require("./chat/chat.js")
const search = require("./board/search.js")
router.use("/register", register);
router.use("/auth", auth);
router.use("/login", login);
router.use("/logout", logout);
router.use("/profile", profile);
router.use("/create", createpage);
router.use("/read", readpage);
router.use("/delete", deletepage);
router.use("/update", updatepage);
router.use("/match", match);
router.use("/scrap", scrap);
router.use("/notice", notice);
router.use("/chat", chat);
router.use("/search", search);

module.exports = router;
