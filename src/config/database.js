const mongoose = require("mongoose")

const connectDB = async () => {
    const connection_string = process.env.MONGODB_URI
    await mongoose.connect(connection_string)
}

module.exports = {connectDB}
