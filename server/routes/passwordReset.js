// Import required modules and models
const { User } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");
const express = require("express");

// Create a router instance
const router = express.Router();

// Handle POST request to generate and send password reset link
router.post("/", async (req, res) => {
    try {
        // Define validation schema for the request body
        const schema = Joi.object({ email: Joi.string().email().required() });

        // Validate the request body against the schema
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Find the user with the given email
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("User with given email doesn't exist");

        // Find or create a token for the user
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        // Generate the password reset link
        const link = `http://localhost:3000/password-reset/${user._id}/${token.token}`;

        // Log the generated link
        let globalLink = `${user._id}/${token.token}`;
        console.log(globalLink);

        // Send the password reset link to the user's email
        await sendEmail(user.email, "Password reset", link);

        // Send response indicating that the password reset link has been sent
        res.send("Password reset link sent to your email account");
    } catch (error) {
        // Handle any errors that occur during the process
        res.send("An error occurred");
        console.log(error);
    }
});

// Handle POST request to reset the password
router.post("/:userId/:token", async (req, res) => {
    try {
        // Define validation schema for the request body
        const schema = Joi.object({ password: Joi.string().required() });

        // Validate the request body against the schema
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Find the user by ID
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("Invalid link or expired");

        // Find the token associated with the user
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        // Update the user's password and save the changes
        user.password = req.body.password;
        await user.save();

        // Delete the token
        await Token.findOneAndDelete({ _id: token._id });

        // Send response indicating that the password has been reset successfully
        res.send("Password reset successfully.");
    } catch (error) {
        // Handle any errors that occur during the process
        res.send("An error occurred");
        console.log(error);
    }
});

// Export the router
module.exports = router;
