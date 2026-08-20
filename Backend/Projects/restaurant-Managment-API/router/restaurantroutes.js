const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantcontroller");
const protect = require("../middleware/auth");

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, createRestaurant);
router.put("/:id", protect, updateRestaurant);
router.delete("/:id", protect, deleteRestaurant);

module.exports = router;
