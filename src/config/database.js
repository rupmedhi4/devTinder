const mongoose = require("mongoose")

const connectDb = async()=>{
    await mongoose.connect("mongodb+srv://medhi0164:1xW5L3W0Mgxc4PgR@cluster0.oqtdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}


module.exports={connectDb}