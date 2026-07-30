const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 5,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/images/google"
    },
    about: {
        type: String,
        default: "This is a dummy About"
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    }
},{
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "devtinderNode", {
        expiresIn : "7d"
    })
    console.log(token)
    return token
}

userSchema.methods.validatePassword = async function(passwordInput){
    const user = this

    const isValidPassword = await bcrypt.compare(passwordInput, user.password)

    return isValidPassword
    
}

module.exports = mongoose.model("User", userSchema)
