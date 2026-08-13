const express = require("express");
const passport = require("passport");
require("../Config/passport");

const {
  register,
  login
} = require("../Controllers/authcontroller");

const router = express.Router();

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local"),
  login
);

module.exports = router;