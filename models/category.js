const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is require",
        minLength: 3,
        maxLength: 150,
    },
    description: {
        type: String,
        required: "Content is require",
        minLength: 3,
        maxLength: 5000,
    }
}, { timestamps: true})

module.exports = mongoose.model("Category", categorySchema)