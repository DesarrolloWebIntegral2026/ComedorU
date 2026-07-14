const rolesMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    const rolId = req.user.rol_id;
    const rolNombre = req.user.rol;

    const rolMap = {
      '1': 'Estudiante',
      '3': 'Vendedor',
    };

    const rolesUsuario = new Set();
    if (rolNombre !== undefined && rolNombre !== null) {
      rolesUsuario.add(String(rolNombre).toLowerCase());
    }
    if (rolId !== undefined && rolId !== null) {
      rolesUsuario.add(String(rolId));
      const mapped = rolMap[String(rolId)];
      if (mapped) {
        rolesUsuario.add(mapped.toLowerCase());
      }
    }

    const rolesPermitidosNormalizados = rolesPermitidos.map((rol) => String(rol).toLowerCase());
    const autorizado = rolesPermitidosNormalizados.some((rol) => rolesUsuario.has(rol));

    if (!autorizado) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
    }

    return next();
  };
};

module.exports = rolesMiddleware;