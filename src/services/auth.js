import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
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
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  return user;
};
export const refreshSessionService = async (req) => {
  const userId = req.session.userId;
  if (!userId) {
    throw createHttpError(401, 'Not authenticated');
  }
  await Session.findOneAndDelete({ userId });
  const newAccessToken = 'new-access-token';
  const newRefreshToken = 'new-refresh-token';
  const newSession = new Session({
    userId: userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  await newSession.save();
  return newAccessToken;
};
export const logoutUser = async (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(new Error('Failed to log out'));
      }
      resolve();
    });
  });
};
