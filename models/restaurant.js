const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const RestaurantSchema = new Schema({
  name: { type: String, required: true, set: capitalizeWords },
  location: { type: String, set: capitalizeWords },
  rating: { type: Number, default: 4 },
  deliveryTime: { type: Number },
  image: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // or "Product" – use your model name here
        required: true,
      },
    },
  ],
});

module.exports = model("Restaurant", RestaurantSchema);
