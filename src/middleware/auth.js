const User = require("../models/user")
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies

        if (!token) {
            throw new Error("Invalid Token")
        }
        const decodedObj = await jwt.verify(token, "RUP@3412#$@")

        const { _id } = decodedObj

        const user = await User.findById(_id)

        if (!user) {
            throw new Error("User does not found")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(400).send("ERROR :" + error.message)
    }
}

module.exports = {
    userAuth
}