const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is require"
    }
}, { timestamps: true})

module.exports = mongoose.model("Role", roleSchema)