const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {accessChat, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatControllers");

const router = express.Router();

// all chat endpoints
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);


module.exports = router;
