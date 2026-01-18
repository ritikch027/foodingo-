const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 20, // max concurrent connections
      minPoolSize: 5, // warm connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4
    });

    console.log("🟢 MongoDB Connected");

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟡 MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🟢 MongoDB reconnected");
    });
  } catch (error) {
    console.error("🔴 MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🟡 MongoDB connection closed");
  process.exit(0);
});

module.exports = connectDB;
