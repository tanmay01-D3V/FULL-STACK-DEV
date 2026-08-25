const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existingUsername = await User.findUserByUsername(username);

    if (existingUsername) {
      return res.status(401).json({ message: "Username Already Exists!!" });
    }

    const existingEmail = await User.findUserByEmail(email);

    if (existingEmail) {
      return res.status(401).json({ message: "Email Already Exists!!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username,
      email,
      password: hashPassword,
    };

    const user = await User.create(newUser);

    return res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Username Doesn't Exists!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password is not valid!!" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      process.env.tokensecret,
      { expiresIn: "3h" },
    );

    res.status(200).json({ message: "Login Successfull!!", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
