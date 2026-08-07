const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rolesMiddleware = require('../middlewares/roles.middleware');

const router = express.Router();

router.get(
  '/menus',
  authMiddleware,
  rolesMiddleware('Vendedor'),
  (req, res) => {
    return res.status(200).json({
      ok: true,
      message: 'Acceso permitido al módulo de menús del vendedor',
      user: req.user,
      data: [
        {
          id: 1,
          nombre: 'Menú de prueba',
          descripcion: 'Gorditas, tamales y lonches',
          precio: 45,
        },
      ],
    });
  }
);

module.exports = router;