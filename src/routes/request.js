const express = require("express")
const userAuth = require("../middlewares/auth")
const requestSchema = require("../models/requestSchema")
const User = require("../models/user")


const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest/:status/:toUserId", userAuth, async (req, res)=> {
    try {

        const user = req.user
        const fromUserId = user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["interested", "ignored"]
        if(!allowedStatus.includes(status)) throw new Error("Invalid Status")

        if(fromUserId.toString() === toUserId.toString()) throw new Error("Cannot send connection request to yourself!")

        const toUserIdData = await User.findById({_id : toUserId})
        if(!toUserIdData) throw new Error("User not Found!")

        const connectionAlreadyExist = await requestSchema.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })
        if(connectionAlreadyExist) throw new Error("Connection Request Already Exist")

        const result = await requestSchema.create({
            fromUserId,
            toUserId,
            status
        })

        res.status(200).json({
            message : "Connection request sent successfully",
            data : result
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log(error)
    }
})

requestRouter.post("/reviewConnectionRequest/:status/:requestId", userAuth, async (req, res)=> {
    try {

        const user = req.user
        const requestId = req.params.requestId
        const status = req.params.status

        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)) throw new Error("Invalid Status")

        const connectionRequest = await requestSchema.findOne({_id : requestId, toUserId : user._id  , status : "interested"})
        if(!connectionRequest) throw new Error("Connection request not Found!")

        connectionRequest.status = status
        console.log(connectionRequest)
        const result = await requestSchema.findByIdAndUpdate({_id : requestId}, connectionRequest)

        res.status(200).json({
            message : "Connection request updated successfully",
            data : result
        })
    } catch (error) {
        res.status(400).send("Error: " + error.message)
        console.log(error)
    }
})


module.exports = requestRouter