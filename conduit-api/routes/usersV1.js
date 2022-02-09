var express = require('express');
var router = express.Router();
var User = require('../models/UserV1');
// var UserV2 = requier('../models')

// regitser user
router.post('/', async (req,res,next)=> {
    try {
        const user = await User.create(req.body);
        res.json({user :await user.userJSON()});
    } catch (error) {
        next(error);
    }
});
// login user
router.post('/login', async (req,res,next)=> {
    const {email,password} = req.body;
    try {
        if(!email || !password){
            return res.status(404).json({ errors: 
                {
                    body : [
                        "Email/Password required"
                    ]
                } 
            })
        };
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                errors : {
                    body : [
                        "Email is not registered"
                    ]
                }
            })
        };
        const result = await user.verifyPassword(password);
        if(!result){
            return res.status(404).json({
                errors : {
                    body : [
                        "Password is In-correct"
                    ]
                }
            })
        };
        const token = await user.signToken();
        res.json({user : await user.userJSON(token)});
    } catch (error) {
        next(error);
    }
});

module.exports = router;
