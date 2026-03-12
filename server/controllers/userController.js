import bcrypt from 'bcrypt';
import User from '../models/User.js';

// ─── Helper: Create structured error ─────────────────────────────────────────
const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// ─── POST /api/users/register ─────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation — triggers 400
    if (!name || !name.trim()) return next(createError('Name is required', 400));
    if (!email || !email.trim()) return next(createError('Email is required', 400));
    if (!password) return next(createError('Password is required', 400));
    if (password.length < 6) return next(createError('Password must be at least 6 characters', 400));

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return next(createError('User with this email already exists', 400));

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
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
