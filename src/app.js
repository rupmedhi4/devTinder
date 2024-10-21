const express = require("express")
const { connectDb } = require("./config/database.js")
const User = require('./models/user.js')
const { validateSignupData } = require("./utils/validation.js")
const bcrypt = require('bcrypt');
const validator = require('validator')
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const {userAuth}=require('./middleware/auth.js')




const app = express()
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
                // Create a JWT Token
                const token = await user.getJWT()
                console.log("Generated Token:", token);
                
                // Set the token in the cookie
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

app.get("/profile",userAuth, async(req, res) => {
 try {
    const user = req.user
    res.send(user)
 } catch (error) {
    res.status(400).send("ERROR :" + error.message)
 }
})


app.post("/sendConnectionRequest",async(req,res)=>{
    
     try {
         // sending a connection request
            
     } catch (error) {
        
     }
})





// //GET user by email
// app.get("/user", async (req, res) => {
//     const userEmailId = req.body.emailId
//     try {
//         const user = await User.findOne({ emailId: userEmailId })
//         if (!user) {
//             res.status(404).send("user not found")
//         } else {
//             res.send(user)
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(400).send("something went wrong")

//     }

// })


// //feed api get all the users from the database
// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (error) {
//         res.status(400).send("something went wrong")
//     }
// })

// //delete api
// app.delete("/user", async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         if (!userId) {
//             return res.status(400).send("User ID is required");
//         }

//         const user = await User.findByIdAndDelete(userId);

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.send("User deleted successfully");
//     } catch (error) {
//         res.status(500).send("Something went wrong");
//     }
// });


// // update data of the user
// app.patch("/user/:userId", async (req, res) => {
//     try {
//         const userId = req.params?.userId
//         const data = req.body

//         const ALLOWED_UPDATES = [
//             "name", "photoUrl", "about", "gender", "age"
//         ]

//         const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))

//         if (!isUpdateAllowed) {
//             // res.status(400).send("updated not allowed")
//             throw new Error("updated not allowed")
//         }

//         if (data?.skills.length > 10) {
//             throw new Error("skills can not be more than 10")
//         }

//         // if (!userId) {
//         //     return res.status(400).send("User ID is required");
//         // }

//         const user = await User.findByIdAndUpdate(userId, data, {
//             runValidators: true
//         }
//         );

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.send("User updated successfully");
//     } catch (error) {
//         res.status(400).send(`updated fail ${error.message}`);
//     }
// });


connectDb().then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("app is listening on port 3000");

    })
}).catch((err) => {
    console.log("db not connected" + err)
})

