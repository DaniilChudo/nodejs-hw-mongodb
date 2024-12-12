import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { _id: decoded.userId };

    if (Date.now() > decoded.exp * 1000) {
      throw createError(401, 'Access token expired');
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
