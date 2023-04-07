const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req,res,next)=>{

    try {
        
        const token=req.cookies.jwt;
    
        const verifyuser = jwt.verify(token , process.env.SECRET_KEY);

        //console.log(verifyuser);
        const user = await Register.findOne({ _id : verifyuser._id , "tokens.token" : token});
        //console.log(user);
        req.token=token;
        req.user=user;

        req.userId=user._id;

        next();

    } catch (error) {
        res.status(401).send("Bina LogIn ke-No Entry");
    }
}

module.exports = auth;