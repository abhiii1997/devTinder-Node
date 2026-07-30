const express = require("express")
const bcrypt = require("bcrypt")
const {validateSignup} = require("../utils/Validation")
const User = require("../models/user")



const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
    const {firstName, lastName, emailId, password} = req.body

    try {
        validateSignup(req)

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
         await User.create({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
         })
         res.status(201).send("User Created Successfully")
    } catch (error) {
        res.status(500).send("Something went wrong" + error.message)
        console.log(error)
    }
})

authRouter.post("/login", async (req, res) => {
    const {emailId, password} = req.body

    try {
        const isEmailExist = await User.findOne({emailId})
        if(!isEmailExist){
            throw new Error("Invalid Credentials!")
        }
        const isValidPassword = await isEmailExist.validatePassword(password)
         if(!isValidPassword){
            throw new Error("Invalid Credentials!")
        }
        const token = await isEmailExist.getJWT()
        res.cookie('token', token)
        res.status(201).send({
            "status" : true,
            "message" : "Logged in successfully"
        })
    } catch (error) {
        res.status(500).send("Error : " + error.message)
        console.log(error)
    }
})

authRouter.post("/logout", async (req, res) => {

    try {
        res.cookie('token', null, {
            maxAge : 0
        })
        res.status(200).send({
            "status" : true,
            "message" : "Logged out successfully"
        })
    } catch (error) {
        res.status(500).send("Error : " + error.message)
        console.log(error)
    }
})

module.exports = authRouter