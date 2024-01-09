const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // authentication of the current logged in user
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try{
            token = req.headers.authorization.split(" ")[1];

            //console.log(token);

            //decode token id
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

            //console.log(decoded);
            req.user = await User.findById(decoded._id).select("-password");

            next();
        }catch(error){
            return res.status(400).send({ message: "unauthorized, failed token"});
        }
    }

    if(!token){
        return res.status(400).send({ message: "unauthorized, no token"});
    }
});

module.exports = { protect };