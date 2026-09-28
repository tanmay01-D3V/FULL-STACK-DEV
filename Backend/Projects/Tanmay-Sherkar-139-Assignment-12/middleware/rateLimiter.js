const rateLimit = require('express-rate-limit');

// Strict rate limiter for ticket booking to prevent ticket-scalping bots and automated spam
const bookingRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Limit each IP to 10 booking requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
  message: {
    success: false,
    message: 'Too many booking requests from this IP. Rate limit exceeded (Maximum 10 requests per minute to prevent ticket scalping).'
  }
});

// General API rate limiter
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

module.exports = {
  bookingRateLimiter,
  generalApiLimiter
};
