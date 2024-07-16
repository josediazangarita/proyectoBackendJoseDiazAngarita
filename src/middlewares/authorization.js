const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo administradores pueden realizar esta acción.');
};


const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo usuarios registrados pueden realizar esta acción.');
};

export { isAdmin, isUser };