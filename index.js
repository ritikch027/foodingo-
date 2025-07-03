const express = require("express");
const connectDB = require("./db");
const categories = require("./routes/category");
const offers = require("./routes/offers");
const items = require("./routes/items");
const users = require("./routes/users");
const restaurants = require("./routes/restaurants");
const cart = require("./routes/cartItems");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(cors());
// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes

app.use("/api", offers);
app.use("/api", users);
app.use("/api", categories);
app.use("/api", items);
app.use("/api", cart);
// inside items.js

app.use("/api", restaurants);
// Homepage route
app.get("/", (req, res) => {
  console.log("I am inside homepage route handler");
  res.send("Hello, welcome to the server");
});

// Start the server
app.listen(PORT, () => {
  console.log("🟢 Backend redeployed successfully");

  console.log(`Server is running on port ${PORT}`);
});
