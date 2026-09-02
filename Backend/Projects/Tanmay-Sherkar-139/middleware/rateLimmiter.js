/**
 * Rate limiting middleware
 * ------------------------
 * Limits requests per IP to prevent API abuse:
 *  - apiLimiter: 100 requests / 15 minutes on all /api routes
 *  - authLimiter: 20 requests / 15 minutes on login + register
 */
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    message: 'Too many requests from this IP. Please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login/register attempts. Please try again later.',
  },
});

module.exports = { apiLimiter, authLimiter };