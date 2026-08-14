const { MongoClient } = require("mongodb");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/employees";

let db;

const client = new MongoClient(MONGO_URL);

async function connectDB() {
  try {
    await client.connect();
    db = client.db("employees");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}

connectDB();

module.exports = db;
