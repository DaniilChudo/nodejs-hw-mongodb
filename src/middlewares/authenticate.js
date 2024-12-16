export const authenticate = (req, res, next) => {
  console.log('Session at authenticate middleware:', req.session);

  const userId = req.session.userId;
  if (!userId) {
    return next(createHttpError(401, 'Not authenticated'));
  }

  req.user = { _id: userId };
  next();
};
