
require("dotenv").config(); 
let mongoose =require('mongoose');
const { on } = require("../models/user");

mongoose.connect(
    process.env.MONGODB_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
mongoose.connection
    .once("open",()=>console.log('db connected'))
    .on("error",error=>{console.log("err",error)})

module.exports= mongoose;