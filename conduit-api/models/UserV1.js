const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new Schema({
    
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
            ref : "V1User"
        }
    ],
    followings : [
        {
            type : Schema.Types.ObjectId,
            ref : "V1User"
        }
    ]
    
}, {timestamps : true});

userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password')){
        try{
            this.password = await bcrypt.hash(this.password,10);
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
        const result = await bcrypt.compare(password,this.password);
        return result;
    } catch (error) {
        return error
    }
};

userSchema.methods.signToken = async function(){
    try {
        const payload = {
            email : this.email,
            id : this.id
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
            email : this.email,
            token : token,
            username : this.username,
            bio : this.bio || null,
            image : this.image || null,
            id : this.id
        }
    } catch (error) {
        return error;
    }
};

userSchema.methods.profileJSON = async function(user = null){
    var isFollowing; 
    if(user && user.followings && user.followings.length >= 1 && user.followings.includes(this.id)){
        isFollowing= true;
    }else {
        isFollowing = false;
    }
    try {
        return {
            "username": this.username,
            "bio": this.bio || null,
            "image": this.image|| null,
            "following" : isFollowing? true:false
        }
    } catch (error) {
        return next(error);
    }
}


module.exports = mongoose.model('V1User',userSchema);