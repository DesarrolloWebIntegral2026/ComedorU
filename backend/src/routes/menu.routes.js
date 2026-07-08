const router = require('express').Router();
const menuRepository = require('../repositories/menu.repository');
const logger = require('../utils/logger');
// isssues #19


// 1. GET: Obtener todos los menús (Vista del Estudiante)

router.get('/', async (req, res) => {
    try {
        const menus = await menuRepository.getAllAvailable();
        return res.status(200).json(menus);
    } catch (error) {
        await logger.error('API_MENU_ERROR', `Error al consultar menús globales: ${error.message}`);
        return res.status(500).json({ message: "Error al obtener la lista de menús." });
    }
});


// 2. GET: Obtener menús de un vendedor específico

router.get('/vendedor/:id', async (req, res) => {
    try {
        const vendedorId = req.params.id;
        const menus = await menuRepository.getByVendedor(vendedorId);
        return res.status(200).json(menus);
    } catch (error) {
        await logger.error('API_MENU_ERROR', `Error al consultar menús del vendedor ${vendedorId}: ${error.message}`);
        return res.status(500).json({ message: "Error al obtener tus menús." });
    }
});


// 3. POST: Publicar un nuevo menú (Vista del Vendedor)

router.post('/', async (req, res) => {
    try {
        const { vendedor_id, titulo, descripcion, precio } = req.body;

        // Validaciones básicas de campos
        if (!vendedor_id || !titulo || !descripcion || !precio) {
            return res.status(400).json({ message: "Todos los campos obligatorios del menú deben ser provistos." });
        }

        // Ejecución delegada al Repositorio
        const nuevoMenuId = await menuRepository.create({ vendedor_id, titulo, descripcion, precio });

        // Auditoría segura (Issue #14): Almacena ID del elemento sin revelar texto de la receta
        await logger.info('MENU_PUBLICADO', `Menú diario ID: ${nuevoMenuId} creado con éxito por el vendedor ID: ${vendedor_id}`);

        return res.status(201).json({ 
            message: "Menú diario publicado con éxito.", 
            menuId: nuevoMenuId 
        });

    } catch (error) {
        await logger.error('API_MENU_ERROR', `Error al insertar menú: ${error.message}`);
        return res.status(500).json({ message: "Error interno del servidor al publicar menú." });
    }
});


// 4. PUT: Editar un menú existente

router.put('/:id', async (req, res) => {
    try {
        const menuId = req.params.id;
        const { vendedor_id, titulo, descripcion, precio, disponible } = req.body;

        const modificado = await menuRepository.update(menuId, vendedor_id, { titulo, descripcion, precio, disponible });

        if (!modificado) {
            return res.status(404).json({ message: "Menú no encontrado o no estás autorizado para editarlo." });
        }

        await logger.info('MENU_MODIFICADO', `Menú ID: ${menuId} actualizado por el vendedor ID: ${vendedor_id}`);
        return res.status(200).json({ message: "Menú actualizado correctamente." });

    } catch (error) {
        await logger.error('API_MENU_ERROR', `Error al modificar menú: ${error.message}`);
        return res.status(500).json({ message: "Error al modificar menú." });
    }
});


// 5. DELETE: Eliminar un menú

router.delete('/:id', async (req, res) => {
    try {
        const menuId = req.params.id;
        const { vendedor_id } = req.body; // El ID del vendedor debe venir en el cuerpo para validar propiedad

        const eliminado = await menuRepository.delete(menuId, vendedor_id);

        if (!eliminado) {
            return res.status(404).json({ message: "Menú no encontrado o no autorizado." });
        }

        await logger.info('MENU_ELIMINADO', `Menú ID: ${menuId} eliminado del sistema por el vendedor ID: ${vendedor_id}`);
        return res.status(200).json({ message: "Menú eliminado de la plataforma." });

    } catch (error) {
        await logger.error('API_MENU_ERROR', `Error al eliminar menú: ${error.message}`);
        return res.status(500).json({ message: "Error al eliminar menú." });
    }
});

module.exports = router;