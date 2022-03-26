const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    age: {
        type: Number,
        required: true
    },
    status: {
        required: true,
        type: Boolean,
        default: true
    },
    avater: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not include "password"')
            }
        }
    },
})

module.exports = mongoose.model("user", userSchema)