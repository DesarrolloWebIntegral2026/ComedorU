const rolesMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
    }

    return next();
  };
};

module.exports = rolesMiddleware;