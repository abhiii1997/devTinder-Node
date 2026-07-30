const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const requestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    status: {
        type: String,
        required: true,
        enum : ["accepted", "ignored", "rejected", "interested"]
    }
},{
    timestamps: true
})

requestSchema.pre("save", function(next) {
    if(this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }
})


module.exports = mongoose.model("requestSchema", requestSchema)