const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Access denied. Only administrators can perform this action.');
};

const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  return res.status(403).send('Access denied. Only registered users can perform this action.');
};

export { isAdmin, isUser };