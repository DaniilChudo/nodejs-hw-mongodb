import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import createError from 'http-errors';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import Session from '../models/session.js';

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

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  await Session.findOneAndDelete({ userId: user._id });

  const newSession = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  await newSession.save();

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
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
