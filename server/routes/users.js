const router = require("express").Router();
const { User, validate } = require("../models/user");
//const jwt = require("jsonwebtoken");
const {allUsers, toggleIsHidden, getUserById} = require("../controllers/userControllers");
const {protect }= require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
	try {
		// validate is used to make sure when creating something it meets certain requirements
		const { error } = validate(req.body);
		if (error) return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });

		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		await new User({ ...req.body }).save();
		// used to update all pre existing user schema
		// User.updateMany(
		// 	{ isHidden: { $exists: false } },
		// 	{ $set: { isHidden: true } }
		// )
		// .then((result) => {
		// 	console.log(`${result.nModified} documents updated`);
		//   })
		//   .catch((error) => {
		// 	console.error('Error updating documents:', error);
		//   })
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.route("/").get(protect, allUsers);
router.route("/toggleHidden").get(protect, toggleIsHidden);
router.route("/user").get(protect, getUserById);

// router.get("/", async (req, res) => {
		
// 		let token;

// 		// authentication of the current logged in user
// 		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
// 		{
// 			try{
// 				token = req.headers.authorization.split(" ")[1];

// 				//console.log(token);

// 				//decode token id
// 				const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

// 				console.log(decoded);
// 				req.user = await User.findById(decoded._id).select("-password");

// 				//next();
// 			}catch(error){
// 				return res.status(400).send({ message: "unauthorized, failed token"});
// 			}
// 		}

// 		if(!token){
// 			return res.status(400).send({ message: "unauthorized, no token"});
// 		}

// 		const keyword = req.query.search
// 		? {
// 			$or:[
// 				{name: {$regex: req.query.search, $options: "i"}},
// 				{email: {$regex: req.query.search, $options: "i"}}
// 			]
// 		}
// 		:{};
		
// 		// search for users except for the currently logged in one
// 		const users = await User.find(keyword).find({ _id:{ $ne: req.user._id} });
		
// 		//console.log(users);
// 		res.send(users); 
		
// });

module.exports = router;
