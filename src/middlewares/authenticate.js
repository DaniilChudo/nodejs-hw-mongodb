import createHttpError from 'http-errors';
export const authenticate = (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    return next(createHttpError(401, 'Not authenticated'));
  }
  req.user = { _id: userId };
  next();
};
