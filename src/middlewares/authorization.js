const isAdmin = (req, res, next) => {
  console.log("🚀 ~ isAdmin ~ isAdmin:", isAdmin)
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo administradores pueden realizar esta acción.');
};

const isUser = (req, res, next) => {
  console.log("🚀 ~ isUser ~ isUser:", isUser)
  console.log('User session:', req.session.user);

  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo usuarios registrados pueden realizar esta acción.');
};

export { isAdmin, isUser };