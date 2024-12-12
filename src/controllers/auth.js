import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import User from '../models/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const register = ctrlWrapper(async (req, res) => {
  const { email, password, username, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    username,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      user: {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      },
    },
  });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, 'Invalid email or password');
  }

  // Створюємо сесію
  req.session.userId = user._id;

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
    },
  });
});

export const logout = ctrlWrapper(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully logged out',
    });
  });
});

export const getCurrentUser = ctrlWrapper(async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    throw createError(401, 'Not authenticated');
  }

  const user = await User.findById(userId);

  res.status(200).json({
    status: 200,
    message: 'User data retrieved successfully',
    data: {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    },
  });
});
