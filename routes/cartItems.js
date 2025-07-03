const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const authenticate = require("../middleware/authenticate");
// Get all categories

router.get("/cart", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/cart/add", authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId or quantity",
      });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      // 🛒 Create new cart
      cart = new Cart({
        user: req.userId,
        items: [{ productId, quantity }],
      });
    } else {
      // 🛒 Add only if not already in cart
      const exists = cart.items.some(
        (item) => item.productId.toString() === productId
      );

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Item already exists in cart. Use increment instead.",
        });
      }

      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

router.post("/cart/increment", authenticate, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing productId" });
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});
router.post("/cart/decrement", authenticate, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing productId" });
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // remove item if quantity becomes 0
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
