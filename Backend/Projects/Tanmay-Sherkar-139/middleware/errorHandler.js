/**
 * Global error handling middleware
 * ---------------------------------
 * notFound returns a 404 for unknown routes; errorHandler catches any error
 * thrown by routes and returns a JSON response with the correct status code.
 */
// 404 handler for unknown endpoints.
const notFound = (req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Global error handler (needs 4 args so Express treats it as error middleware).
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { details: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };