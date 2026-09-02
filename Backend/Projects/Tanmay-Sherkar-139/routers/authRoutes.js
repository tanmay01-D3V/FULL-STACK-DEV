const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimmiter');
const { validate } = require('../middleware/validator');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} = require('../utils/validation');

router.post('/register',authLimiter,validate(registerValidation),authController.register);

router.post('/login', authLimiter, validate(loginValidation), authController.login);

router.get('/profile', auth, authController.getProfile);

router.put('/profile',auth,validate(updateProfileValidation),authController.updateProfile);

module.exports = router;