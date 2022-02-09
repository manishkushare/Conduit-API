var jwt = require('jsonwebtoken');
var User = require('../models/UserV1');
module.exports = {
    verifyToken : async (req,res,next)=> {
        const token = req.headers.authorization;
        if(token){
            try {
                const payload = jwt.verify(token, process.env.SECRET);
                req.user = await User.findById(payload.id);
                return next();
            } catch (error) {
                return next(error);
            }
        }else {
            return res.status(403).json({
                "errors":{
                    "body": [
                      "Token Required"
                    ]
                  }
            })
        }
    }
}