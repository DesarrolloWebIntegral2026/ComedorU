const rateLimit = require('express-rate-limit');

// Configuración de OWASP: Máximo 5 intentos por 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
  max: 5, // Límite de 5 intentos por dirección IP
  message: {
    status: 429,
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = { loginLimiter };