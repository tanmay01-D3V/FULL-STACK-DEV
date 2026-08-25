const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(400).json({ message: "Unauthorized Access!!" });
  }

  try {
    req.user = jwt.verify(token, process.env.tokensecret);
  } catch (error) {
    return res.status(401).json({ message: "Token Is Not Valid!!" });
  }

  next();
};

module.exports = authMiddleware;
