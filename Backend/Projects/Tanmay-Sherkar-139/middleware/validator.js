/**
 * Validation middleware
 * ---------------------
 * Composes express-validator rule chains (defined in utils/validation.js)
 * with an error aggregator. Returns a 400 response listing all validation
 * errors when the request body/params/queries are invalid.
 */
const { validationResult } = require('express-validator');

// Combine rule chains + error check into a single middleware array.
const validate = (rules) => [
  rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed.',
        errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
      });
    }
    next();
  },
];

module.exports = { validate };