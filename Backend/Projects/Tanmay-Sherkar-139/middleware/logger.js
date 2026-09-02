/**
 * Request logging middleware
 * --------------------------
 * Logs every incoming request (method, URL, timestamp, current user) to
 * provide an audit trail of API usage.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const user = req.user ? req.user.email : 'anonymous';
  const logMessage = [
    `[${timestamp}]`,
    req.method,
    req.originalUrl,
    `user: ${user}`,
  ].join(' ');
  console.log(logMessage);
  next();
};

module.exports = logger;