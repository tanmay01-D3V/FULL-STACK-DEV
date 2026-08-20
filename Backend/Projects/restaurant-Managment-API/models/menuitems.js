const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    restaurantId: {
      type: Number,
      required: [true, "Please add a restaurant ID"],
      ref: "Restaurant",
    },
    name: {
      type: String,
      required: [true, "Please add a menu item name"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, _id: false },
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
