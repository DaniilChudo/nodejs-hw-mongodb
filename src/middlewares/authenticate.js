export const authenticate = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  req.user = { _id: req.session.userId };
  next();
};
