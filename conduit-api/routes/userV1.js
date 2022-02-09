const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/UserV1');
var bcrypt = require('bcrypt');
router.use(auth.verifyToken);
// get current user
router.get('/', async(req,res,next)=> {
    return res.json({user : req.user});
}); 
// update current user
router.put('/', async (req,res,next)=> {
    const id = req.user.id;
    if('password' in req.body){
        req.body.password = await bcrypt.hash(req.body.password,10);
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id,req.body,{new : true});
        res.json({user : updatedUser});

    } catch (error) {
        next(error);
    }
});




module.exports = router;