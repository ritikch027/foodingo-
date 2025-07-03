const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // or "Product" – use your model name here
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = model("Cart", CartSchema);
