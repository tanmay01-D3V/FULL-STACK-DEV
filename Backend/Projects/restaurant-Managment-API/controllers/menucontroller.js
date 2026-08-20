const MenuItem = require("../models/menuitems");
const Counter = require("../models/counter");

const getNextSequence = async (modelName) => {
  const counter = await Counter.findOneAndUpdate(
    { modelName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return counter.seq;
};

const getMenuByRestaurant = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      restaurantId: Number(req.params.id),
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const nextId = await getNextSequence("MenuItem");
    const menuItem = await MenuItem.create({
      _id: nextId,
      ...req.body,
      restaurantId: Number(req.params.id),
    });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      Number(req.params.id),
      req.body,
      { new: true },
    );
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(Number(req.params.id));
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
