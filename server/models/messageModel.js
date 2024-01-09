const mongoose = require("mongoose");
const { User } = require("./user");
const { string } = require("joi");
const chat = require("./chatModel");

const messageModel = new mongoose.Schema({
    sender: {type:mongoose.Schema.Types.ObjectId, ref:User},
    content: {type: String, trim: true},
    chat: {type:mongoose.Schema.Types.ObjectId, ref:chat},
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
}, {timestamps: true,})

const message = mongoose.model("Message", messageModel);

module.exports = message;