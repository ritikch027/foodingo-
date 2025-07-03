const express = require("express");
const router = express.Router();
const Category = require("../models/categories");

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new category
router.post("/categories", async (req, res) => {
  try {
    const { category, image } = req.body;
    const existing = await Category.findOne({ category });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category Already Exists" });
    }
    // Validate input
    if (!existing) {
      const newCategory = new Category({ category, image });
      await newCategory.save();

      res.status(201).json({
        success: true,
        category: newCategory,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
