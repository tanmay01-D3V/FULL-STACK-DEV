const express = require("express");
const router = express.Router();
const {
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menucontroller");
const protect = require("../middleware/auth");

router.get("/:id/menu", getMenuByRestaurant);
router.post("/:id/menu", protect, addMenuItem);
router.put("/menu/:id", protect, updateMenuItem);
router.delete("/menu/:id", protect, deleteMenuItem);

module.exports = router;
