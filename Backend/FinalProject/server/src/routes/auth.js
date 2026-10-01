import { Router } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0].msg });
  next();
};
const tokenFor = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["candidate", "recruiter"])
      .withMessage("Role must be candidate or recruiter"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const exists = await User.findOne({
        email: req.body.email.toLowerCase(),
      });
      if (exists)
        return res
          .status(409)
          .json({ message: "An account with this email already exists" });
      const user = await User.create(req.body);
      res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        email: req.body.email.toLowerCase(),
      }).select("+password");
      if (!user || !(await user.comparePassword(req.body.password)))
        return res
          .status(401)
          .json({ message: "Email or password is incorrect" });
      res.json({ token: tokenFor(user), user: publicUser(user) });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/me", protect, (req, res) =>
  res.json({ user: publicUser(req.user) }),
);
export default router;
