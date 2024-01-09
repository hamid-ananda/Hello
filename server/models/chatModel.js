//const { string, boolean } = require("joi");
const mongoose = require("mongoose");
//const { User } = require("./User");

const chatModel = new mongoose.Schema(
    {
        chatName: { type: String, trim: true},
        isGroupChat: {type: Boolean, default: false },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // this has to be lower case for some reason??????

        },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    }

    ,{
        timestamps: true,
    }
)

const chat = mongoose.model("Chat", chatModel);

module.exports = chat;