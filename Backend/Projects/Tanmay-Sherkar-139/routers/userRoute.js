const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { validate } = require('../middleware/validator');
const { userIdParamValidation, updateRoleValidation } = require('../utils/validation');

router.get('/', auth, requireRole('librarian'), userController.getAllUsers);

router.get('/:id',auth,requireRole('librarian'),validate(userIdParamValidation),userController.getUserById);

router.put('/:id/role',auth,requireRole('librarian'),validate(updateRoleValidation),userController.updateUserRole  );

router.delete('/:id',auth,requireRole('librarian'),validate(userIdParamValidation),userController.deleteUser);

module.exports = router;