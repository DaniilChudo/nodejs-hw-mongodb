import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import User from '../models/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUser,
  registerUser,
  refreshSessionService,
  logoutUser,
} from '../services/auth.js';

export const register = ctrlWrapper(async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await registerUser({ name, email, password: hashedPassword });
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { name: newUser.name, email: newUser.email },
  });
});
export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser({ email, password });
  req.session.userId = user._id;
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: { user: { name: user.name, email: user.email } },
  });
});
export const refresh = ctrlWrapper(async (req, res) => {
  const newAccessToken = await refreshSessionService(req);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newAccessToken },
  });
});
export const logout = ctrlWrapper(async (req, res) => {
  await logoutUser(req);
  res.status(204).send();
});
