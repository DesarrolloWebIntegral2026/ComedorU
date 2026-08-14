const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const rolesMiddleware = require('../middlewares/roles.middleware');
const {
    crearPedido,
    obtenerMisPedidos,
    obtenerPedidosVendedor,
    actualizarEstadoPedido
} = require('../controllers/pedido.controller');

// 1. Estudiante crea un pedido desde el carrito
router.post(
    '/',
    authMiddleware,
    rolesMiddleware('Estudiante'),
    crearPedido
);

// 2. Estudiante consulta sus pedidos
router.get(
    '/mis-pedidos',
    authMiddleware,
    rolesMiddleware('Estudiante'),
    obtenerMisPedidos
);

// 3. Vendedor consulta los pedidos recibidos
router.get(
    '/vendedor',
    authMiddleware,
    rolesMiddleware('Vendedor'),
    obtenerPedidosVendedor
);

// 4. Vendedor actualiza el estado del pedido (ej. listo, entregado)
router.put(
    '/:id/estado',
    authMiddleware,
    rolesMiddleware('Vendedor'),
    actualizarEstadoPedido
);

module.exports = router;
