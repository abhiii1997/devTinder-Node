const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if(!token){
            res.status(401).send({
            "status" : "failure",
            "message" : "Invalid credentials!"
        })
        }
        const decyptedValue = await jwt.verify(token, "devtinderNode")
        const result = await User.findById({ _id: decyptedValue._id })

        if(!result){
            res.status(401).send({
            "status" : "failure",
            "message" : "Invalid credentials!"
        })
        }
        req.user = result
        next()
    } catch (error) {
        res.status(500).send("Error : " + error.message)
    }
}

module.exports = userAuth