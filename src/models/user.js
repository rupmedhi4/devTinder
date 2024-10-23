const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true

    },
    emailId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        require: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is weak")
            }
        }
    },
    age: {
        type: Number,
        require: true,
        min: 18,
    },
    gender: {
        type: String,
        require: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid gender")
            }
        }


    },
    photoUrl: {
        type: String,
        default: "https://smsdelhibmw.co.in/wp-content/uploads/2022/02/User-Profile-PNG.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid url")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }
}, { Timestamp: true })


userSchema.methods.getJWT = async function () {

    const user = this
    const token = await jwt.sign({ _id: user._id }, "RUP@3412#$@");

    return token

}
userSchema.methods.validatePassword = async function (password) {

    const user = this
    const isPasswordValid = await bcrypt.compare(password, user.password)

    return isPasswordValid

}





const User = mongoose.model("User", userSchema)

module.exports = User