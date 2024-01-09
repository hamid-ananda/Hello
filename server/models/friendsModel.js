const mongoose = require("mongoose");
const { User } = require("./user");

const friendsModel = new mongoose.Schema(
    {
        user: {type:mongoose.Schema.Types.ObjectId, ref:User},
        friends:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        ]
    }
)

const friendsList = mongoose.model("FriendsList", friendsModel);

module.exports = friendsList;