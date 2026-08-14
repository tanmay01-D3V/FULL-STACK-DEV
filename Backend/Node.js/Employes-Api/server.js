const express = require("express");
const cors = require("cors");
const db = require("./config/Db");
const employeeRouter = require("./router/EMPLOYEEROUTER");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Employee API Server is running" });
});

app.use("/api/employees", employeeRouter);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
module.exports = app;
