const asyncHandler = require("express-async-handler");
//const jwt = require("jsonwebtoken");
const {User} = require("../models/user");

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
    ? {
        $or:[
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    }
    :{};
    //console.log(keyword);
    
    // search for users except for the currently logged in one
    console.log(req.user);
    const users = await User.find(keyword).find({ _id:{ $ne: req.user._id} });
    
    
    res.send(users); 
    
		
});

const toggleIsHidden = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Toggle isActive value
        user.isHidden = !user.isHidden;
        await user.save();
    
        res.status(200).json({ message: "isHidden toggled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Unable to toggle isHidden", error: error.message });
    }
});

const getUserById = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id; // Assuming the user ID is sent in the request body
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  });

module.exports = {allUsers, toggleIsHidden, getUserById};