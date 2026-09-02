/**
 * Authentication middleware
 * -------------------------
 * Verifies the JWT in the Authorization header, loads the current user from
 * Firestore and attaches it to req.user. Rejects missing/invalid/expired tokens.
 */
const { verifyToken } = require('../utils/jwt');
const { usersCollection } = require('../Config/firebase');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token has expired. Please log in again.'
          : 'Invalid token.';
      return res.status(401).json({ message });
    }

    const userSnap = await usersCollection.doc(decoded.userId).get();
    if (!userSnap.exists) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = { userId: userSnap.id, ...userSnap.data() };
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Authentication error', error: err.message });
  }
};

module.exports = auth;