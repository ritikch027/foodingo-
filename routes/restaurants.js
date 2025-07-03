const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
const User = require("../models/user");
const authenticate = require("../middleware/authenticate");

// ✅ GET all restaurants
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ POST - Create a new restaurant
router.post("/restaurants", authenticate, async (req, res) => {
  try {
    const { name, rating = 4.0, deliveryTime = 30, location, image } = req.body;

    // ✅ Validate required fields
    if (!name || !location) {
      return res
        .status(401)
        .json({ success: false, message: "Name and location are required" });
    }

    const owner = req.userId; // from JWT middleware

    // ✅ Optional: Check if user already owns a restaurant
    const existing = await Restaurant.findOne({ owner });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "You already have a restaurant" });
    }

    const newRestaurant = new Restaurant({
      name,
      owner,
      rating,
      deliveryTime,
      location,
      image,
    });

    await newRestaurant.save();

    // ✅ Update user's role
    await User.findByIdAndUpdate(owner, {
      role: "owner",
      restaurant: newRestaurant._id,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (err) {
    console.error("Error creating restaurant:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
});

module.exports = router;
