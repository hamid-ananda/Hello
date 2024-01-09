const asyncHandler = require("express-async-handler");

const friendsList = require("../models/friendsModel");

const findFriends = asyncHandler(async (req, res) => {

    try {
        const { search } = req.query;
  
        // if (!userId || !search) {
        //   return res.status(400).json({ message: 'Both user ID and search query are required' });
        // }
        //console.log(userId);

        //console.log(req.user._id.toString());
        const userFriends = await friendsList.findOne({ user: req.user._id.toString() }).populate('friends', 'firstName email');;
  
        if (!userFriends) {
          return res.status(404).json({ message: 'User friends not found' });
        }
        //console.log(userFriends);
  
        const matchingFriends = userFriends.friends.filter(friend => {
            //console.log(friend);
          return friend.firstName.toLowerCase().includes(search.toLowerCase());
        });
  
        return res.status(200).json({ matchingFriends });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
		
});

const allFriends = async (req, res) => {
    try {
        // const { userId } = req.query;
  
        // if (!userId) {
        //   return res.status(400).json({ message: 'User ID is required' });
        // }
  
        //console.log(userId);
        const userFriends = await friendsList.findOne({ user: req.user._id }).populate('friends', 'firstName email'); // Adjust the fields you want to populate
  
        if (!userFriends) {
          return res.status(404).json({ message: 'User friends not found' });
        }
  
        return res.status(200).json({ friends: userFriends.friends, userId: req.user._id });
      } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
};

const allOtherFriends = async (req, res) => {
  try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      //console.log(userId);
      const userFriends = await friendsList.findOne({ user: userId }).populate('friends', 'firstName email'); // Adjust the fields you want to populate

      if (!userFriends) {
        return res.status(200).json({ friends: [] });
      }

      return res.status(200).json({ friends: userFriends.friends });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
};



const addFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.query;
  
        if (!userId || !friendId) {
          return res.status(400).json({ message: 'Both user ID and friend ID are required' });
        }
  
        const userFriends = await friendsList.findOne({ user: userId });
  
        if (!userFriends) {
          return res.status(404).json({ message: 'User friends not found' });
        }
  
        if (userFriends.friends.includes(friendId)) {
          return res.status(400).json({ message: 'Friend already exists in the list' });
        }
  
        userFriends.friends.push(friendId);
        await userFriends.save();
  
        return res.status(200).json({ message: 'Friend added successfully' });
      } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
};

const removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.query;
  
        if (!userId || !friendId) {
          return res.status(400).json({ message: 'Both user ID and friend ID are required' });
        }
  
        const userFriends = await friendsList.findOne({ user: userId });
  
        if (!userFriends) {
          return res.status(404).json({ message: 'User friends not found' });
        }
  
        const friendIndex = userFriends.friends.indexOf(friendId);
  
        if (friendIndex === -1) {
          return res.status(400).json({ message: 'Friend not found in the list' });
        }
  
        userFriends.friends.splice(friendIndex, 1);
        await userFriends.save();
  
        return res.status(200).json({ message: 'Friend removed successfully' });
      } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
};

const initializeFriendsList = asyncHandler(async (req, res) => {
    try {
        //const { userId } = req.query;
        //console.log(userId);

        // if (!userId) {
        //     return res.status(400).json({ message: 'User ID is required' });
        // }

        const existingList = await friendsList.findOne({ user: req.user._id });
        //console.log(existingList);

        if (existingList) {
            return res.status(200).json({ message: 'Friend list already exists for the user' });
        }

        const newFriendList = new friendsList({ user: req.user._id, friends: [] });
        await newFriendList.save();

        return res.status(200).json({ message: 'Friend list initialized successfully' });
    } catch (err) {
        console.error(err);
    }
});


module.exports = {allFriends, allOtherFriends, addFriend, removeFriend, initializeFriendsList, findFriends}