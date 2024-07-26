const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo los administradores pueden realizar esta acción.');
};

const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo los usuarios registrados pueden realizar esta acción.');
};

const isPremium = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'premium') {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo los usuarios premium pueden realizar esta acción.');
};

const isAdminOrPremium = (req, res, next) => {
  if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'premium')) {
    return next();
  }
  return res.status(403).send('Acceso denegado. Solo los administradores o usuarios premium pueden realizar esta acción.');
};

export { isAdmin, isUser, isPremium, isAdminOrPremium };