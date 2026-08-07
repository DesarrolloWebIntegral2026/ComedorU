const jwt = require('jsonwebtoken');
const users = require('../utils/users.mock');

const login = (req, res) => {
  const { correo, password, rol } = req.body;

  const user = users.find(
    (currentUser) =>
      currentUser.correo === correo && currentUser.password === password
  );

  if (!user) {
    return res.status(401).json({
      ok: false,
      message: 'Credenciales inválidas',
    });
  }

  if (rol && rol !== user.rol) {
    return res.status(403).json({
      ok: false,
      message: 'El rol enviado no coincide con el usuario autenticado',
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  // ==========================================
  // CONFIGURACIÓN DE COOKIE SEGURA (OWASP TOP 10)
  // ==========================================
  res.cookie('token', token, {
    httpOnly: true,       // ✓ Bloquea el acceso desde JavaScript (Previene robos por XSS)
    secure: false,        // ✓ En desarrollo (localhost/HTTP) debe ser false para que el navegador la acepte. En producción (HTTPS) se cambia a true.
    sameSite: 'none',      // ✓ Directiva estándar para mitigar ataques de falsificación de peticiones en sitios cruzados (CSRF)
    maxAge: 3600000       // Expiración estricta de 1 hora en milisegundos
  });

  return res.status(200).json({
    ok: true,
    message: 'Inicio de sesión exitoso',
    token, // Se mantiene en el cuerpo por compatibilidad con el estado del FrontEnd
    user: {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    },
  });
};

const profile = (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'Perfil obtenido correctamente',
    user: req.user,
  });
};

module.exports = {
  login,
  profile,
};