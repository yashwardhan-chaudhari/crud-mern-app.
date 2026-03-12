import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Protect Middleware: Verify JWT Token ─────────────────────────────────────
// Apply to any route that requires authentication
export const protect = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Not authorized. Please login.');
      err.status = 401;
      return next(err);
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user and attach to request
    const user = await User.findById(decoded.userId);
    if (!user) {
      const err = new Error('User no longer exists.');
      err.status = 401;
      return next(err);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Your session has expired. Please login again.');
      err.status = 401;
      return next(err);
    }
    if (error.name === 'JsonWebTokenError') {
      const err = new Error('Invalid token. Please login again.');
      err.status = 401;
      return next(err);
    }
    next(error);
  }
};
