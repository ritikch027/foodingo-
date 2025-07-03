const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Restaurant = require("../models/restaurant");
const authenticate = require("../middleware/authenticate");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all categories
router.get("/items/category/:categoryName", async (req, res) => {
  try {
    const category = req.params.categoryName;
    const items = await Item.find({ category });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/items/restaurant/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const items = await Item.find({ restaurant: restaurantId });

    res.status(200).json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post("/items/:restaurantId", authenticate, async (req, res) => {
  try {
    const { name, category, price, discountPercent, image, isVeg } = req.body;
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant)
      return res.status(404).json({ message: "Create your Restaurant First" });

    if (restaurant.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this restaurant" });
    }

    const item = new Item({
      name,
      category,
      price,
      discountPercent,
      image,
      isVeg,
      restaurant: restaurantId,
    });

    await item.save();

    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/items/remove/:restaurantId", authenticate, async (req, res) => {
  try {
    const { productId } = req.body;
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    if (restaurant.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this restaurant" });
    }

    const item = await Item.findById(productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Extract public_id from image_url (assuming it's in standard Cloudinary format)
    const imageUrl = item.image_url;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // removes .jpg/.png etc.

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete item from DB
    await item.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Item and image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
