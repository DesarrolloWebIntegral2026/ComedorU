const dbSingleton = require('../config/db.singleton');

class MenuRepository {
    constructor() {
        // Obtenemos la única instancia compartida del Pool por medio del Singleton
        this.db = dbSingleton.getPool();
    }

    // 1. Crear un nuevo menú diario (Acción del Vendedor)
    async create(menuData) {
        const { vendedor_id, titulo, descripcion, precio } = menuData;
        const query = 'INSERT INTO menus (vendedor_id, titulo, descripcion, precio) VALUES (?, ?, ?, ?)';
        const [result] = await this.db.query(query, [vendedor_id, titulo, descripcion, precio]);
        return result.insertId;
    }

    // 2. Obtener todos los menús disponibles (Acción del Estudiante / Home Público)
    async getAllAvailable() {
        const query = `
            SELECT m.*, u.nombre AS vendedor_nombre 
            FROM menus m 
            JOIN usuarios u ON m.vendedor_id = u.id 
            WHERE m.disponible = 1 
            ORDER BY m.creado_en DESC`;
        const [rows] = await this.db.query(query);
        return rows;
    }

    // 3. Obtener menús publicados por un vendedor específico
    async getByVendedor(vendedorId) {
        const query = 'SELECT * FROM menus WHERE vendedor_id = ? ORDER BY creado_en DESC';
        const [rows] = await this.db.query(query, [vendedorId]);
        return rows;
    }

    // 4. Actualizar disponibilidad o datos de un menú
    async update(menuId, vendedorId, updateData) {
        const { titulo, descripcion, precio, disponible } = updateData;
        const query = `
            UPDATE menus 
            SET titulo = ?, descripcion = ?, precio = ?, disponible = ? 
            WHERE id = ? AND vendedor_id = ?`;
        const [result] = await this.db.query(query, [titulo, descripcion, precio, disponible, menuId, vendedorId]);
        return result.affectedRows > 0;
    }

    // 5. Eliminar un menú
    async delete(menuId, vendedorId) {
        const query = 'DELETE FROM menus WHERE id = ? AND vendedor_id = ?';
        const [result] = await this.db.query(query, [menuId, vendedorId]);
        return result.affectedRows > 0;
    }
}

module.exports = new MenuRepository();