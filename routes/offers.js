const express = require("express");
const router = express.Router();
const Offer = require("../models/offer");

// Get all categories
router.get("/offers", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new category
router.post("/offers", async (req, res) => {
  try {
    const { title, description, discountPercent, image_url, public_id } =
      req.body;

    // Validate input

    const newOffer = new Offer({
      title,
      description,
      discountPercent,
      image,
    });
    await newOffer.save();

    res.status(201).json({
      success: true,
      offer: newOffer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
