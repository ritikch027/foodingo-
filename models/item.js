const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ItemSchema = new Schema({
  name: { type: String, required: true, set: capitalizeWords },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number },
  offerPrice: { type: Number },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
  },
  isVeg: { type: Boolean },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});
ItemSchema.pre("save", function (next) {
  if (this.discountPercent && this.price) {
    this.offerPrice = Math.round(
      this.price - (this.price * this.discountPercent) / 100
    );
  } else {
    this.offerPrice = this.price; // no discount
  }
  next();
});

module.exports = model("Item", ItemSchema);
