const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const employeeRouter = require("./router/employee_router");
const app = express();
const port = process.env.PORT || 3000;

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
  console.log(`Server running on port ${port}`);
});
