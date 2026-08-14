const mongoose = require("mongoose");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/employees";

mongoose.connect(MONGO_URL).catch((error) => {
  console.log("MongoDB connection error:", error);
});

const db = mongoose.connection;

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

db.on("error", (error) => {
  console.log("MongoDB connection error:", error);
});

module.exports = db;
