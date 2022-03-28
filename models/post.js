const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema

const postSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    likes: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("post", postSchema)