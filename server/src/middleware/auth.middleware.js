const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'omnikart_secret_jwt_key_2026');
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is disabled or user not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user?.role}' does not have access. Allowed: [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorizeRoles };
