const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");
const dotenv = require("dotenv");
// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // ✅ fixed variable name
    res.status(200).json(users); // ✅ changed from 'categories' to 'users'
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new user (Signup)
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login user
router.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token (correct usage)
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
      await cart.save();
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail }).then((data) => {
      res.send({ status: "ok", userData: data });
    });
  } catch (error) {
    return res.send({ error: "error" });
  }
});

module.exports = router;
