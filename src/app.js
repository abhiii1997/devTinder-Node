const express = require("express")
const { connectDB } = require("./config/database")
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

const app = new express()
const PORT = 3000

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


connectDB().
    then(() => {
        console.log("Database Connection successful")
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    }).catch((err) => {
        console.log("Some error occured while connecting DB")
    })
