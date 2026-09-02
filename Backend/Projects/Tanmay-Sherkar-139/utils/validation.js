const { body, param, query } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'librarian'])
    .withMessage('Role must be either "student" or "librarian"'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
];

const bookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN is required')
    .isLength({ min: 10, max: 13 })
    .withMessage('ISBN must be between 10 and 13 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

const updateBookValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('isbn')
    .optional()
    .trim()
    .isLength({ min: 10, max: 13 })
    .withMessage('ISBN must be between 10 and 13 characters'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

const bookIdParamValidation = [
  param('id').notEmpty().withMessage('Book id is required'),
];

const userIdParamValidation = [
  param('id').notEmpty().withMessage('User id is required'),
];

const updateRoleValidation = [
  param('id').notEmpty().withMessage('User id is required'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'librarian'])
    .withMessage('Role must be either "student" or "librarian"'),
];

const bookQueryValidation = [
  query('title').optional().trim(),
  query('author').optional().trim(),
  query('category').optional().trim(),
  query('status')
    .optional()
    .isIn(['available', 'borrowed'])
    .withMessage('Status must be either "available" or "borrowed"'),
];

const searchQueryValidation = [
  query('q')
    .notEmpty()
    .withMessage('Search query "q" is required')
    .trim()
    .isLength({ min: 1 }),
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  bookValidation,
  updateBookValidation,
  bookIdParamValidation,
  userIdParamValidation,
  updateRoleValidation,
  bookQueryValidation,
  searchQueryValidation,
};