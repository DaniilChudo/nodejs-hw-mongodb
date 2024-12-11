import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import createError from 'http-errors';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const register = ctrlWrapper(async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(201).json({
    status: 201,
    message: 'User successfully registered',
    data: {
      user: {
        email: newUser.email,
        username: newUser.username,
      },
      token,
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

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({
    status: 200,
    message: 'User successfully logged in',
    data: {
      user: {
        email: user.email,
        username: user.username,
      },
      token,
    },
  });
});

export const logout = ctrlWrapper(async (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'User successfully logged out',
  });
});

export const getCurrentUser = ctrlWrapper(async (req, res) => {
  const { _id, email, username } = req.user;

  res.status(200).json({
    status: 200,
    message: 'User data retrieved successfully',
    data: {
      user: {
        _id,
        email,
        username,
      },
    },
  });
});
