const checkRole = (roles) => (req, res, next) => {
  if (req.session.user && roles.includes(req.session.user.role)) {
    return next();
  }
  return res.status(403).send(`Acceso denegado. Solo los roles permitidos pueden realizar esta acción: ${roles.join(', ')}`);
};

const isAdmin = checkRole(['admin']);
const isUser = checkRole(['user']);
const isPremium = checkRole(['premium']);
const isAdminOrPremium = checkRole(['admin', 'premium']);
const isUserOrPremium = checkRole(['user', 'premium']);
const isUserOrAdmin = checkRole(['user', 'admin']);

export { isAdmin, isUser, isPremium, isAdminOrPremium, isUserOrPremium, isUserOrAdmin };