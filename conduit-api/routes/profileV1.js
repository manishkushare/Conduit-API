const express = require('express');
const router = express.Router();
const User = require('../models/UserV1');
const auth = require('../middlewares/auth');

// get profile by username
router.get('/:username', auth.verifyToken,async (req,res,next)=> {
    const username = req.params.username;
    console.log(req.user, " :user");
    try {
        // const currentUser = await User.findById(req.user.id).populate("followings");
        let profile = await User.findOne({username});
        profile = await profile.profileJSON(req.user);
        res.json({profile});
    } catch (error) {
        next(error);
    }
});
// follow a profile
router.post('/:username/follow', auth.verifyToken,async (req,res,next)=> {
    const username = req.params.username;
    try {
        let profile = await User.findOneAndUpdate({username},{$push : {followers:req.user.id}},{new: true});
        if(req.user.followings.length >= 1 && req.user.followings.includes(profile.id)){
            res.json({msg : `You already follow ${profile.username}`, profile : await profile.profileJSON(req.user) });
        } else {
            const currentUser = await User.findByIdAndUpdate(req.user.id, {$push : {followings : profile.id}},{new: true});
            res.json({profile : await profile.profileJSON(currentUser)}) ;

        }

    } catch (error) {
        next(error);
    }
});
// unfollow a profile
router.delete('/:username/unfollow', auth.verifyToken,async (req,res,next)=> {
    const username = req.params.username;
    try {
        let profile = await User.findOneAndUpdate({username},{$pull : {followers : req.user.id}},{new: true});
        
        if(req.user.followings && req.user.followings.length >= 1 && req.user.followings.includes(profile.id)){
            var currentUser = await User.findByIdAndUpdate(req.user.id, {$pull : {followings : profile.id}},{new: true});
            res.json({profile : await profile.profileJSON(currentUser)}) ;
        } else {
            res.json({msg : `You Do not follow ${profile.username}`, profile : await profile.profileJSON(currentUser) });

        }

    } catch (error) {
        next(error);
    }
});

module.exports = router;