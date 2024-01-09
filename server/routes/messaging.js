const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
    allMessages,
    sendMessage,
  } = require("../controllers/messageControllers");

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;