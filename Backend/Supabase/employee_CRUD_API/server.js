const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, ".env") });

const employeeRouter = require("./router/employee_router");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/employees", employeeRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Employee CRUD API is running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
