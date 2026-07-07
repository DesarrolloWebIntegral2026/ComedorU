const { body } = require('express-validator');

const hasHtmlOrScript = (value) => {
  const htmlScriptPattern = /<[^>]*>|script|javascript:/i;
  return htmlScriptPattern.test(value);
};

const hasSqlInjectionPattern = (value) => {
  const sqlPattern =
    /('|--|;|\/\*|\*\/|\bOR\b|\bAND\b|\bDROP\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bUNION\b|1\s*=\s*1)/i;

  return sqlPattern.test(value);
};

const validateLogin = [
  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail()
    .custom((value) => {
      if (hasHtmlOrScript(value)) {
        throw new Error('El correo contiene código HTML o JavaScript no permitido');
      }

      if (hasSqlInjectionPattern(value)) {
        throw new Error('El correo contiene patrones sospechosos de SQL Injection');
      }

      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[a-z]/)
    .withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
    .custom((value) => {
      if (hasHtmlOrScript(value)) {
        throw new Error('La contraseña contiene código HTML o JavaScript no permitido');
      }

      if (hasSqlInjectionPattern(value)) {
        throw new Error('La contraseña contiene patrones sospechosos de SQL Injection');
      }

      return true;
    }),
];

const validateRole = [
  body('rol')
    .optional()
    .trim()
    .isIn(['cliente', 'vendedor'])
    .withMessage('El rol permitido solo puede ser cliente o vendedor'),
];

module.exports = {
  validateLogin,
  validateRole,
};