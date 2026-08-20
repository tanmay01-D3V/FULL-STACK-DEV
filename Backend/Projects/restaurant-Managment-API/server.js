require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
connectDB();

const restaurantRouter = require("./router/restaurantroutes");
const menuRouter = require("./router/menuroutes");
const authRouter = require("./router/authroutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:4000",
      "http://127.0.0.1:5000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Restaurant APIs" });
});

app.use("/auth", authRouter);
app.use("/restaurants", menuRouter);
app.use("/restaurants", restaurantRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
