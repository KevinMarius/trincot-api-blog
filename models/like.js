const mongoose = require('mongoose')
const Post = require('./post')
const User = require('./user')

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId, ref: "Post"
    },
    user: {
        type: mongoose.Types.ObjectId, ref: "User"
    },
    isLike: { 
        type: Number 
    }
}, { timestamps: true})

module.exports = mongoose.model("Like", likeSchema)