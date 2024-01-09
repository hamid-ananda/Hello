// Importing the required modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the token schema
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user", // Reference to the "user" model
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // Token will expire after 3600 seconds (1 hour)
    },
});

// Exporting the token model
module.exports = mongoose.model("token", tokenSchema);
