const dbSingleton = require('../config/db.singleton');

class PedidoRepository {
    constructor() {
        this.db = dbSingleton.getPool();
    }

    // 1. Crear un nuevo pedido con sus detalles en una transacción
    async createPedido(clienteId, items, notas = '') {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();

            // Calcular total general y obtener el vendedor del primer ítem (o por ítem)
            let totalGeneral = 0;
            const vendedorId = items[0]?.vendedor_id || 3; // Default al vendedor del platillo

            for (const item of items) {
                totalGeneral += parseFloat(item.precio) * parseInt(item.cantidad);
            }

            // Insertar encabezado del pedido
            const queryPedido = `
                INSERT INTO pedidos (cliente_id, vendedor_id, total, estado, notas) 
                VALUES (?, ?, ?, 'pendiente', ?)
            `;
            const [resultadoPedido] = await connection.query(queryPedido, [
                clienteId,
                vendedorId,
                totalGeneral.toFixed(2),
                notas || null
            ]);

            const pedidoId = resultadoPedido.insertId;

            // Insertar detalles del pedido
            const queryDetalle = `
                INSERT INTO detalle_pedidos (pedido_id, menu_id, cantidad, precio_unitario, subtotal) 
                VALUES (?, ?, ?, ?, ?)
            `;

            for (const item of items) {
                const subtotal = parseFloat(item.precio) * parseInt(item.cantidad);
                await connection.query(queryDetalle, [
                    pedidoId,
                    item.id,
                    item.cantidad,
                    parseFloat(item.precio).toFixed(2),
                    subtotal.toFixed(2)
                ]);
            }

            await connection.commit();
            return {
                id: pedidoId,
                cliente_id: clienteId,
                vendedor_id: vendedorId,
                total: totalGeneral.toFixed(2),
                estado: 'pendiente',
                notas
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 2. Obtener pedidos realizados por un cliente (Estudiante)
    async getPedidosByCliente(clienteId) {
        const queryPedidos = `
            SELECT p.*, u.nombre AS vendedor_nombre 
            FROM pedidos p
            LEFT JOIN usuarios u ON p.vendedor_id = u.id
            WHERE p.cliente_id = ?
            ORDER BY p.creado_en DESC
        `;
        const [pedidos] = await this.db.query(queryPedidos, [clienteId]);

        if (pedidos.length === 0) return [];

        // Obtener detalles de todos los pedidos del cliente
        const pedidoIds = pedidos.map(p => p.id);
        const queryDetalles = `
            SELECT d.*, m.titulo, m.descripcion
            FROM detalle_pedidos d
            JOIN menus m ON d.menu_id = m.id
            WHERE d.pedido_id IN (?)
        `;
        const [detalles] = await this.db.query(queryDetalles, [pedidoIds]);

        // Agrupar detalles dentro de cada pedido
        return pedidos.map(pedido => ({
            ...pedido,
            items: detalles.filter(d => d.pedido_id === pedido.id)
        }));
    }

    // 3. Obtener pedidos recibidos por un vendedor
    async getPedidosByVendedor(vendedorId) {
        const queryPedidos = `
            SELECT p.*, u.nombre AS cliente_nombre, u.apellidos AS cliente_apellidos, u.telefono AS cliente_telefono
            FROM pedidos p
            LEFT JOIN usuarios u ON p.cliente_id = u.id
            WHERE p.vendedor_id = ?
            ORDER BY p.creado_en DESC
        `;
        const [pedidos] = await this.db.query(queryPedidos, [vendedorId]);

        if (pedidos.length === 0) return [];

        const pedidoIds = pedidos.map(p => p.id);
        const queryDetalles = `
            SELECT d.*, m.titulo, m.descripcion
            FROM detalle_pedidos d
            JOIN menus m ON d.menu_id = m.id
            WHERE d.pedido_id IN (?)
        `;
        const [detalles] = await this.db.query(queryDetalles, [pedidoIds]);

        return pedidos.map(pedido => ({
            ...pedido,
            items: detalles.filter(d => d.pedido_id === pedido.id)
        }));
    }

    // 4. Actualizar el estado de un pedido (por parte del vendedor)
    async updateEstado(pedidoId, vendedorId, nuevoEstado) {
        const query = `
            UPDATE pedidos 
            SET estado = ? 
            WHERE id = ? AND vendedor_id = ?
        `;
        const [result] = await this.db.query(query, [nuevoEstado, pedidoId, vendedorId]);
        return result.affectedRows > 0;
    }
}

module.exports = new PedidoRepository();
