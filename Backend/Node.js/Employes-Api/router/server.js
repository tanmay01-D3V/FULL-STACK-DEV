const express = require("express");
const db=require ("../config/Db");
const employeeRouter=require("./EMPLOYEEROUTER");
const app=express();
app.use(express.json());
app.use("/api/employees",employeeRouter);
module.exports=app;