const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var User = require('./UserV1');

const commentSchema  = new Schema({
    body : {
        type : String,
        required : true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "V1User"
    },
    article : {
        type : Schema.Types.ObjectId,
        ref : "V1Article"
    }
},{timestamps: true});

commentSchema.methods.commentJSON = async function(currentUser =null, creatorUser = null){
    console.log(currentUser,creatorUser);
    var userInfo = null;
    if(creatorUser){
        userInfo = await User.findById(creatorUser.id);

    }
    console.log(userInfo, " : userInfo");
    try {
        return {
            "id": this.id,
            "createdAt": this.createdAt,
            "updatedAt": this.updatedAt,
            "body": this.body,
            "author": await userInfo.profileJSON(currentUser)
        }
    } catch (error) {
        return error;   
    }
}

module.exports = mongoose.model('V1Comment',commentSchema);