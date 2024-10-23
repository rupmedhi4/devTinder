const express = require("express")
const { connectDb } = require("./config/database.js")
const cookieParser = require('cookie-parser')

const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')


const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)

connectDb().then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("app is listening on port 3000");

    })
}).catch((err) => {
    console.log("db not connected" + err)
})





