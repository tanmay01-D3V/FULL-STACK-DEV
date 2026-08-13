const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    connectDB.db = mongoose.connection.db;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB.ObjectId = mongoose.Types.ObjectId;

module.exports = connectDB;