const mongoose = require('mongoose')

const enumStateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: "Title is require"
    }
})

module.exports = mongoose.model("EnumState", enumStateSchema)