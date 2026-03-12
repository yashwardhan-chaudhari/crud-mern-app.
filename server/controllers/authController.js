import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input — 400 Bad Request
    if (!email || !password) {
      return next(createError('Please provide email and password', 400));
    }

    // 2. Find user by email (explicitly include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // 3. Generic error — don't reveal whether email exists (security)
    if (!user) {
      return next(createError('Invalid email or password', 401));
    }

    // 4. Compare password with hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(createError('Invalid email or password', 401));
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // 6. Remove password from response
    user.password = undefined;

    // 7. Send token + user data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
