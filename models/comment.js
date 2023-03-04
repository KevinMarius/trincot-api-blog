const mongoose = require('mongoose')
const Post = require('./post')

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Title is require",
        minLength: 3,
        maxLength: 150,
    },
    content: {
        type: String,
        minLength: 2,
        maxLength: 5000,
    },
    post: {
        type: mongoose.Types.ObjectId, 
        ref: "Post"
    }
}, { timestamps: true})

module.exports = mongoose.model("Comment", commentSchema)