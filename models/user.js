const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const UserSchema = new Schema({
  name: { type: String, required: true, set: capitalizeWords },
  email: { type: String, unique: true, lowercase: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  image_url: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
  },
  role: {
    type: String,
    enum: ["customer", "owner", "admin"],
    default: "customer",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    default: null, // or required: true if mandatory
  },
});

module.exports = model("User", UserSchema);
