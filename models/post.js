const mongoose = require('mongoose')
const Category = require('./category')
const User = require('./user')
const EnumState = require('./state')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is require",
        minLength: 3,
        maxLength: 150,
    },
    content: {
        type: String,
        required: "Content is require",
        minLength: 3,
        maxLength: 5000,
    },
    picture: {
        type: String,
    },
    state: {
        type: mongoose.Types.ObjectId, 
        ref: "EnumState"
    },
    category: {
        type: mongoose.Types.ObjectId, 
        ref: "Category"
    },
    author: {
        type: mongoose.Types.ObjectId, 
        ref: "User"
    },
    tags: [{
        type: String
    }],
    hashTags: [{
        type: String
    }],
    likes: {
        type: Number,
        min: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)