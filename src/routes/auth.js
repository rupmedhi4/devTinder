const express = require('express')
const bcrypt = require('bcrypt');
const { validateSignupData } = require("../utils/validation");
const User = require('../models/user');
const validator = require('validator')


const authRouter = express.Router()


authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, gender, photoUrl, about, skills } = req.body

        //validation of data
        validateSignupData(req)

        //encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)

        //creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
            skills
        })

        await user.save()
        res.send("user added successfully")
    } catch (error) {
        res.status(400).send("error saving the user:" + error.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body

        if (!validator.isEmail(emailId)) {
            return res.status(400).send("invalid credentials")
        }

        const user = await User.findOne({ emailId })

        if (!user) {
            return res.status(400).send("invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            try {

                const token = await user.getJWT()
                res.cookie("token", token);
                res.status(200).send("Login successful");
                
            } catch (error) {
                console.error("Error generating token:", error);
                res.status(500).send("Server error");
            }
        } else { 
            res.status(400).send("Invalid credentials");
        }
        

    } catch (error) {
        res.status(400).send("ERROR :" + error.message)
    }
})

authRouter.post('/logout',(req,res)=>{
   // res.clearCookie('token')
   res.cookie("token",null)
   res.status(200).send("logged out successfully")
})

module.exports=authRouter