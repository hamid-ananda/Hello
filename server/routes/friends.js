const express = require("express");
const {allFriends, allOtherFriends, addFriend, removeFriend, initializeFriendsList, findFriends} = require("../controllers/friendsController");
const {protect }= require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allFriends);
router.route("/otherFriends").get(allOtherFriends);
router.route("/init").get(protect, initializeFriendsList);
router.route("/findFriends").get(protect, findFriends);
router.route("/addFriend").put(addFriend);
router.route("/removeFriend").put(removeFriend);

module.exports = router;