const router = require('express').Router();
const { body } = require('express-validator');
const menuRepository = require('../repositories/menu.repository');
const logger = require('../utils/logger');
const authMiddleware = require('../middlewares/auth.middleware');
const rolesMiddleware = require('../middlewares/roles.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
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

router.get('/vendedor/:id', authMiddleware, rolesMiddleware('Vendedor'), async (req, res) => {
    try {
        const vendedorId = req.params.id;
        if (parseInt(vendedorId, 10) !== req.user.id) {
            return res.status(403).json({ message: "No estás autorizado para ver los menús de otro vendedor." });
        }

        const menus = await menuRepository.getByVendedor(vendedorId);
        return res.status(200).json(menus);
    } catch (error) {
        await logger.error('API_MENU_ERROR', `Error al consultar menús del vendedor ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: "Error al obtener tus menús." });
    }
});


// 3. POST: Publicar un nuevo menú (Vista del Vendedor)

router.post(
    '/',
    authMiddleware,
    rolesMiddleware('Vendedor'),
    [
        body('titulo').trim().notEmpty().withMessage('El título del menú es obligatorio.'),
        body('descripcion').trim().notEmpty().withMessage('La descripción es obligatoria.'),
        body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0.'),
    ],
    validationMiddleware,
    async (req, res) => {
        try {
            const { titulo, descripcion, precio } = req.body;
            const vendedor_id = req.user.id;

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

router.put('/:id', authMiddleware, rolesMiddleware('Vendedor'), async (req, res) => {
    try {
        const menuId = req.params.id;
        const { titulo, descripcion, precio, disponible } = req.body;
        const vendedor_id = req.user.id;

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

router.delete('/:id', authMiddleware, rolesMiddleware('Vendedor'), async (req, res) => {
    try {
        const menuId = req.params.id;
        const vendedor_id = req.user.id;

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