/**
 * Role-based access control middleware
 * ------------------------------------
 * Guards routes so only users with one of the allowed roles can access them.
 * Must run after the auth middleware because it relies on req.user.
 * @param {...string} roles - list of allowed roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
};

module.exports = requireRole;