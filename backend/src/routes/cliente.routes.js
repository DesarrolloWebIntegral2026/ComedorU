const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rolesMiddleware = require('../middlewares/roles.middleware');

const router = express.Router();

router.get(
  '/pedidos',
  authMiddleware,
  rolesMiddleware('cliente'),
  (req, res) => {
    return res.status(200).json({
      ok: true,
      message: 'Acceso permitido al módulo de pedidos del cliente',
      user: req.user,
      data: [
        {
          id: 1,
          descripcion: 'Pedido de prueba para cliente',
          estado: 'pendiente',
        },
      ],
    });
  }
);

module.exports = router;