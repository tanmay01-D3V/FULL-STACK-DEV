const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a restaurant name"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    cuisine: {
      type: String,
      required: [true, "Please add a cuisine type"],
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, _id: false },
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
