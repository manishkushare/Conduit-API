const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');
var User = require('./UserV1');

const articleSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    taglist : [String],
    slug : {
        type: String
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "V1User"
    },
    liked : [
        {
            type : Schema.Types.ObjectId,
            ref : "V1User"
        }
    ]

}, {timestamps : true});

articleSchema.pre('save' , async function(next){
    try {
        if(this.title && this.isModified('title')){
            this.slug = await slug(this.title);
            next();
        }
    } catch (error) {
        next(error);
    }
});

articleSchema.methods.articleJSON = async function(currentUser =null, creatorUser = null){
    console.log(currentUser,creatorUser);
    var isLiked = false;
    var userInfo = null;
    if(currentUser){
         isLiked = this.liked.includes(currentUser.id)
    }
    if(creatorUser){
         userInfo = await User.findById(creatorUser.id);

    }
    console.log(isLiked,userInfo)
    try {
        return {
            slug : this.slug,
            title : this.title,
            description : this.description,
            body : this.body,
            taglist : this.taglist,
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
            favorited : isLiked? true:false,
            favoritedCount : this.liked.length,
            author : await userInfo.profileJSON(currentUser)
        }
    } catch (error) {
        return error;   
    }
}

module.exports = mongoose.model('V1Article',articleSchema);