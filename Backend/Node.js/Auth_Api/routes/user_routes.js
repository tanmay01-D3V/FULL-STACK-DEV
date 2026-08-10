const express = require('express');
const user = require('../models/user');
const bcrpyt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authmiddleware = require('../middleware/authmiddleware');

router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await user.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username, email, or phone already exists' });
    }
    const hashedPassword = await bcrpyt.hash(password, 10);
    const newUser = new user({ username, email, phone, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const token = jwt.sign({ 
      userid: user._id,
      username: user.username,
      email: user.email,
     }, 'your_jwt_secret', { expiresIn: '1h' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', authmiddleware, async (req, res) => {
  try {
    res.status(200).json({message: "user profile",user: req.user});
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;