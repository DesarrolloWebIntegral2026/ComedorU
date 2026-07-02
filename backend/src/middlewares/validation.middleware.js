const { validationResult } = require('express-validator');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: 'Datos inválidos',
      errors: errors.array().map((error) => ({
        campo: error.path,
        mensaje: error.msg,
      })),
    });
  }

  return next();
};

module.exports = validationMiddleware;