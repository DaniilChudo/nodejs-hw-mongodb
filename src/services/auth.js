import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Session from '../models/session.js';

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ ...userData, password: hashedPassword });
  await newUser.save();
  return newUser;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export const refreshSessionService = async (refreshToken) => {
  let userId;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await Session.findOneAndDelete({ userId });

  const newAccessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );
  const newRefreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' },
  );

  const newSession = new Session({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  await newSession.save();

  return { accessToken: newAccessToken };
};
