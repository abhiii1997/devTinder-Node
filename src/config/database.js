const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhikhandelwal11397:Abhi%400918@cluster0.iliqdh1.mongodb.net/devTinder")
}

module.exports = {connectDB}
