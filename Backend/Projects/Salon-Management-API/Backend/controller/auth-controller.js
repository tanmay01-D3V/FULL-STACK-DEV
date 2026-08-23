const jwt = require("jsonwebtoken");
const authModel = require("../models/authentication");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = "7d";

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const user = await authModel.createUser({
    name,
    email: String(email).toLowerCase().trim(),
    password,
  });

  const token = signToken(user);
  res.status(201).json({ message: "Signup successful", token, user });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password are required" });
  }

  const user = await authModel.verifyCredentials(
    String(email).toLowerCase().trim(),
    password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user);
  res.status(200).json({ message: "Login successful", token, user });
}

module.exports = { signup, login };
