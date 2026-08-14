const express = require("express");
const passport = require("passport");
require("../Config/passport");

const {
  register,
  login,
  logout
} = require("../Controllers/authcontroller");

const router = express.Router();

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local"),
  login
);

router.post("/logout", logout);

module.exports = router;