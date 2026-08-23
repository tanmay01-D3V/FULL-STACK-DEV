const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, ".env") });

const servicesRouter = require("./router/services-router");
const authRouter = require("./router/auth-router");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/services", servicesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "services CRUD API is running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res
    .status(status)
    .json({ message: status === 500 ? "Internal server error" : err.message });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
