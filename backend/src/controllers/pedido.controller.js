const pedidoRepository = require('../repositories/pedido.repository');
const logger = require('../utils/logger');

// 1. Crear nuevo pedido (Estudiante)
const crearPedido = async (req, res) => {
    try {
        const clienteId = req.user.id;
        const { items, notas } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                ok: false, 
                message: 'El carrito no contiene productos válidos.' 
            });
        }

        // Validar estructura básica de los ítems
        for (const item of items) {
            if (!item.id || !item.precio || !item.cantidad || item.cantidad <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Uno o más productos en el carrito tienen datos inválidos.'
                });
            }
        }

        const nuevoPedido = await pedidoRepository.createPedido(clienteId, items, notas);
        
        await logger.info('PEDIDO_CREADO', `Cliente ID ${clienteId} realizó el pedido #${nuevoPedido.id} por un total de $${nuevoPedido.total}`);

        return res.status(201).json({
            ok: true,
            message: '¡Pedido realizado con éxito!',
            pedido: nuevoPedido
        });
    } catch (error) {
        await logger.error('PEDIDO_ERROR', `Error al crear pedido para cliente ${req.user?.id}: ${error.message}`);
        return res.status(500).json({
            ok: false,
            message: 'Ocurrió un error al procesar el pedido. Verifica que la tabla de pedidos exista en la base de datos.',
            error: error.message
        });
    }
};

// 2. Obtener pedidos del estudiante autenticado
const obtenerMisPedidos = async (req, res) => {
    try {
        const clienteId = req.user.id;
        const pedidos = await pedidoRepository.getPedidosByCliente(clienteId);
        return res.status(200).json({
            ok: true,
            pedidos
        });
    } catch (error) {
        await logger.error('PEDIDOS_MIS_ERROR', `Error al obtener pedidos del cliente ${req.user?.id}: ${error.message}`);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener la lista de tus pedidos.'
        });
    }
};

// 3. Obtener pedidos asignados a un vendedor
const obtenerPedidosVendedor = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        const pedidos = await pedidoRepository.getPedidosByVendedor(vendedorId);
        return res.status(200).json({
            ok: true,
            pedidos
        });
    } catch (error) {
        await logger.error('PEDIDOS_VENDEDOR_ERROR', `Error al obtener pedidos para vendedor ${req.user?.id}: ${error.message}`);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener los pedidos de la cocina/vendedor.'
        });
    }
};

// 4. Cambiar estado de un pedido (Vendedor)
const actualizarEstadoPedido = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                ok: false,
                message: `Estado inválido. Estados permitidos: ${estadosPermitidos.join(', ')}`
            });
        }

        const actualizado = await pedidoRepository.updateEstado(id, vendedorId, estado);
        if (!actualizado) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el pedido o no tienes autorización para modificarlo.'
            });
        }

        await logger.info('PEDIDO_ESTADO_ACTUALIZADO', `Vendedor ID ${vendedorId} actualizó el pedido #${id} al estado: ${estado}`);

        return res.status(200).json({
            ok: true,
            message: `Estado del pedido actualizado a "${estado}" con éxito.`
        });
    } catch (error) {
        await logger.error('PEDIDO_ACTUALIZAR_ERROR', `Error al actualizar estado de pedido ${req.params.id}: ${error.message}`);
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar el estado del pedido.'
        });
    }
};

module.exports = {
    crearPedido,
    obtenerMisPedidos,
    obtenerPedidosVendedor,
    actualizarEstadoPedido
};
