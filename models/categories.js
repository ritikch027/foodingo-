const { Schema, model } = require("mongoose");

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CategorySchema = new Schema({
  category: {
    type: String,
    required: true,
    maxlength: 30,
    unique: true,
    set: capitalizeWords,
  },
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

module.exports = model("Category", CategorySchema); // Collection will be 'categories'
