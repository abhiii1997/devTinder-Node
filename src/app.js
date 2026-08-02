require('dotenv').config();
const express = require("express")
const { connectDB } = require("./config/database")
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const cors = require("cors")

const app = new express()
const PORT = 3000

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

const PORT = process.env.PORT
connectDB().
    then(() => {
        console.log("Database Connection successful")
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    }).catch((err) => {
        console.log("Some error occured while connecting DB")
    })
