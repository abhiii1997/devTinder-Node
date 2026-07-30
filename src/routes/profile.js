const express = require("express")
const userAuth = require("../middlewares/auth")
const {validateProfileData} = require("../utils/Validation")
const User = require("../models/user")



const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req, res)=> {
    try {
        const result = req.user
        res.status(200).json({
            message : "data sent successfully",
            data : result
        })
    } catch (error) {
        res.status(500).send("Something went wrong" + error.message)
        console.log(error)
    }
})

profileRouter.post("/profile/edit", userAuth, async (req, res)=> {
    try {

        if(!validateProfileData(req)){
            throw new Error("Invalid Edit")
        }

        const user = req.user

        Object.keys(req.body).forEach(ele => user[ele] = req.body[ele])
        const updated_res = await User.findByIdAndUpdate(user._id, user)
        res.status(200).json({
            message : "data Updated successfully",
            data : updated_res
        })
    } catch (error) {
        res.status(500).send("Something went wrong" + error.message)
        console.log(error)
    }
})


module.exports = profileRouter