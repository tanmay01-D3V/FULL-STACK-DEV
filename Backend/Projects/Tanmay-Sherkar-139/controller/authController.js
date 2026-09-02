const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/userModel");

const sanitizeUser = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || "student";

    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      throw new ApiError(409, "Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = signToken({
      userId: user.userId,
      role: user.role,
      email: user.email,
    });

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const token = signToken({
      userId: user.userId,
      role: user.role,
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.user.userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updates = {};

    if (req.body.name) updates.name = req.body.name.trim();

    if (req.body.email) {
      const newEmail = req.body.email.trim();
      const owner = await userModel.findUserByEmail(newEmail);
      if (owner && owner.userId !== userId) {
        throw new ApiError(409, "Email is already in use by another account.");
      }
      updates.email = newEmail;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long.");
      }
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, "No valid fields provided to update.");
    }

    const updatedUser = await userModel.updateUser(userId, updates);
    res.status(200).json({
      message: "Profile updated successfully.",
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile };
