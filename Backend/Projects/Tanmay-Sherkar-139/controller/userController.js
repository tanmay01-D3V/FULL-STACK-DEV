const ApiError = require('../utils/ApiError');
const userModel = require('../models/userModel');

const sanitizeUser = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};

const getAllUsers = async (req, res, next) => {
  try {
    const role = req.query.role;
    const users = await userModel.findAllUsers(role);
    res.status(200).json({ count: users.length, users: users.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    const updatedUser = await userModel.updateUserRole(req.params.id, req.body.role);
    res.status(200).json({
      message: 'User role updated successfully.',
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    await userModel.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser };