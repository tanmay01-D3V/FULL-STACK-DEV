const mongodb = require('mongodb');

const mongodb = MONGO_URL 

 db.on("disconnected",()=>{
console.log("MongoDB disconnected")
 });

 db.on("error",(error)=>{
    console.log("MongoDB connection error:",error);
 });
 module.exports=db;