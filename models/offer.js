const { Schema, model } = require("mongoose");

const OfferSchema = new Schema({
  title: { type: String, required: true, maxlength: 30 },
  description: { type: String },
  discountPercent: { type: Number },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
  },
});

module.exports = model("Offer", OfferSchema);
