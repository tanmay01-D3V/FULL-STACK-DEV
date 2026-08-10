const mongoose = require('mongoose');

mongoose.connect ("mongodb://localhost:27017/itm_employees")
 const db = mongoose.connection;
 db.on("connected",()=>{
    console.log("MongoDB  connected Successfully");
 });
 db.on("disconnected",()=>{
console.log("MongoDB disconnected")
 });

 db.on("error",(error)=>{
    console.log("MongoDB connection error:",error);
 });
 module.exports=db;