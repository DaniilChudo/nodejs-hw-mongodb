export const authenticate = (req, res, next) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  req.user = { _id: userId };

  next();
};
