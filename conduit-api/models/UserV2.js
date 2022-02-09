const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new Schema({
  user: {
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required: true
    },
    bio : {
        type : String
    },
    image : {
        type : String
    },
    followers : [
        {
            type : Schema.Types.ObjectId,
            ref : "V2User"
        }
    ],
    followings : [
        {
            type : Schema.Types.ObjectId,
            ref : "V2User"
        }
    ]
    
  }
    
}, {timestamps : true});

userSchema.pre('save', async function(next){
    if(this.user.password && this.isModified('user.password')){
        try{
            this.user.password = await bcrypt.hash(this.user.password,10);
            next();
        } catch {
            next(error);
        }    
    } else {
        next();
    }
    
});

userSchema.methods.verifyPassword = async function(password){
    try {
        const result = await bcrypt.compare(password,this.user.password);
        return result;
    } catch (error) {
        return error
    }
};

userSchema.methods.signToken = async function(){
    try {
        const payload = {
            email : this.user.email,
            id : this.user.id
        };
        const token = jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error) {
        return error;
    }
};

userSchema.methods.userJSON = async function(token = null){
    try {
        return {
            email : this.user.email,
            token : token,
            username : this.user.username,
            bio : this.user.bio || null,
            image : this.user.image || null,
            id : this.user.id
        }
    } catch (error) {
        return error;
    }
};

userSchema.methods.profileJSON = async function(user = null){
    var isFollowing; 
    if(user && user.followings && user.followings.length >= 1 && user.followings.includes(this.user.id)){
        isFollowing= true;
    }else {
        isFollowing = false;
    }
    try {
        return {
            "username": this.user.username,
            "bio": this.user.bio || null,
            "image": this.user.image|| null,
            "following" : isFollowing? true:false
        }
    } catch (error) {
        return next(error);
    }
}


module.exports = mongoose.model('V2User',userSchema);