const express = require("express");
const router = express.Router();

const isAdmin = require("../../middleware/isAdmin");
const authenticate = require("../../middleware/authenticate");
const { getAdmins, handleBan } = require("../../controllers/admin/adminController");
const { getAllUsers } = require("../../controllers/admin/userController");
const { getRestaurants } = require("../../controllers/customer/publicController");
const {
  deleteRestaurant,
} = require("../../controllers/owner/restaurantController");

router.get("/admin", authenticate, isAdmin, getAdmins);

// User management aliases
router.get("/admin/users", authenticate, isAdmin, getAllUsers);
router.patch("/admin/users/:userId/ban", authenticate, isAdmin, handleBan);

// Restaurant management aliases
router.get("/admin/restaurants", authenticate, isAdmin, getRestaurants);
router.delete(
  "/admin/restaurants/:restaurantId",
  authenticate,
  isAdmin,
  deleteRestaurant,
);

module.exports = router;
