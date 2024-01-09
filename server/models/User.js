// Import required modules
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Define the user schema
const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isHidden: {type: Boolean, default: true },
});

// Define a method to generate authentication token for the user
userSchema.methods.generateAuthToken = function () {
	const token1 = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token1;
};

// Create the User model using the user schema
const User = mongoose.model("user", userSchema);

// Define a validation function using Joi
const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		// isHidden: Joi.boolean().required().label("Is Hidden"),
	});
	return schema.validate(data);
};

// Export the User model and the validation function
module.exports = { User, validate };
