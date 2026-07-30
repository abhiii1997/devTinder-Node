const express = require("express")
const userAuth = require("../middlewares/auth")
const requestSchema = require("../models/requestSchema")
const User = require("../models/user")

const userRouter = express.Router()
const SAFEDATA = ["firstName", "lastName", "age", "gender", "photoUrl", "about"]

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const user = req.user

        const result = await requestSchema.find({ toUserId: user._id, status: "interested" })
            .populate("fromUserId", SAFEDATA)

        res.status(200).json({
            message: "Connection request received successfully",
            data: result
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log(error)
    }
})

userRouter.get("/user/connections/", userAuth, async (req, res) => {
    try {

        const user = req.user

        const result = await requestSchema.find({
            $or: [
                { toUserId: user._id, status: "accepted" },
                { fromUserId: user._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", SAFEDATA)
            .populate("toUserId", SAFEDATA)

        const filterResult = result.map(record => {
            if (user._id.toString() === record.fromUserId._id.toString()) return record.toUserId
            return record.fromUserId
        })

        res.status(200).json({
            message: "Connection requests",
            data: filterResult
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log(error)
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const page = req.query.page || 1
        let limit = req.query.limit
        limit = limit<50 ? limit : 50
        const skip = (page-1)*limit
        const user = req.user

        const connectionRequests = await requestSchema.find({
            $or: [
                { toUserId: user._id },
                { fromUserId: user._id }
            ]
        }).select("toUserId fromUserId")

        let hideUsers = new Set()
        connectionRequests.forEach(ele => {
            hideUsers.add(ele.toUserId.toString())
            hideUsers.add(ele.fromUserId.toString())
        })

        const users = await User.find(
            {
                $and: [
                    {
                        _id: { $nin: Array.from(hideUsers) }
                    },
                    {
                        _id: { $ne: user._id }
                    }
                ]
            }
        ).select(SAFEDATA)
        .skip(skip)
        .limit(limit)

        res.status(200).json({
            message: "Connection requests",
            data: users
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log(error)
    }
})

module.exports = userRouter