const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso autorizado');
};

const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  return res.status(403).send('Acceso autorizado');
};

export { isAdmin, isUser };