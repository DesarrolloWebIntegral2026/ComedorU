const express = require('express');
const router = express.Router();
const logger = require('../utils/logger'); 
const db = require('../config/db'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Controladores y Middlewares del Sistema
const { login, profile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { loginLimiter } = require('../middlewares/rateLimit');
const validationMiddleware = require('../middlewares/validation.middleware');
const { validateLogin, validateRole } = require('../middlewares/security.validators');

// ==========================================
// RUTA DE INICIO DE SESIÓN (LOGIN)
// ==========================================
router.post('/login', loginLimiter, validateLogin, validateRole, validationMiddleware, async (req, res) => {
    try {
        const { correo, password } = req.body;

        const [usuarios] = await db.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        const usuarioEncontrado = usuarios[0];

        if (!usuarioEncontrado) {
            await logger.info('LOGIN_FALLIDO', `Intento de inicio de sesión rechazado para la cuenta: ${correo || 'No provista'}`);
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuarioEncontrado.password);
        
        if (!passwordCorrecto) {
            await logger.info('LOGIN_FALLIDO', `Contraseña incorrecta para la cuenta: ${correo}`);
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const nombreRol = usuarioEncontrado.rol_id === 1 ? 'Estudiante' : usuarioEncontrado.rol_id === 3 ? 'Vendedor' : 'Administrador';
        await logger.info('LOGIN_EXITOSO', `El usuario con ID: ${usuarioEncontrado.id} ha ingresado con el rol_id: ${usuarioEncontrado.rol_id} (${nombreRol})`);

        const token = jwt.sign({
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            correo: usuarioEncontrado.correo,
            rol_id: usuarioEncontrado.rol_id,
            rol: nombreRol
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 3600000
        });

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token
        });

    } catch (error) {
        await logger.error('ERROR_LOGIN', `Error en el servidor durante el proceso de login: ${error.message}`);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// ==========================================
// RUTA DE REGISTRO PÚBLICO (Con express-validator)
// ==========================================
router.post('/register', [
    // 1. Nombre: Solo letras y espacios (Soporta acentos y Ñ)
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre no debe contener números ni caracteres especiales.'),

    // 2. Apellidos: Solo letras y espacios
    body('apellidos')
        .trim()
        .notEmpty().withMessage('Los apellidos son obligatorios.')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('Los apellidos no deben contener números ni caracteres especiales.'),

    // 3. Correo Electrónico: Formato email válido y limpio
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('El formato del correo electrónico no es válido.')
        .normalizeEmail(),

    // 4. Contraseña: Mínimo 8 caracteres
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener un mínimo de 8 caracteres.'),

    // 5. Teléfono: Totalmente opcional, pero si se escribe, valida que sean 10 números
    body('telefono')
        .optional({ checkFalsy: true }) // Permite que venga vacío, nulo o un string sin texto
        .isNumeric().withMessage('El teléfono celular solo debe contener números.')
        .isLength({ min: 10, max: 10 }).withMessage('El teléfono debe tener exactamente 10 dígitos.'),

    // 6. Rol obligatorio
    body('rol')
        .notEmpty().withMessage('El rol es obligatorio.')
], async (req, res) => {
    
    // Capturar y procesar errores de express-validator
    const erroresValidacion = validationResult(req);
    if (!erroresValidacion.isEmpty()) {
        const listaErrores = erroresValidacion.array().map(err => err.msg);
        return res.status(400).json({ errors: listaErrores });
    }

    try {
        const { nombre, apellidos, correo, password, telefono, rol } = req.body;

        const rolesPermitidos = ['Estudiante', 'Vendedor'];
        if (!rolesPermitidos.includes(rol)) {
            await logger.error('REGISTRO_RECHAZADO', `Intento de registro con un rol no autorizado: ${rol || 'Ninguno'}`);
            return res.status(400).json({ message: "El rol seleccionado no es válido." });
        }

        const rol_id = rol === 'Estudiante' ? 1 : 3;

        const [usuariosExistentes] = await db.promise().query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);

        const queryInsert = 'INSERT INTO usuarios (nombre, apellidos, correo, password, telefono, rol_id) VALUES (?, ?, ?, ?, ?, ?)';
        const [resultado] = await db.promise().query(queryInsert, [nombre, apellidos, correo, passwordEncriptado, telefono || null, rol_id]);

        await logger.info('REGISTRO_USUARIO', `Usuario nuevo creado exitosamente con ID: ${resultado.insertId} asignado al rol_id: ${rol_id} (${rol})`);

        return res.status(201).json({ message: "Usuario registrado con éxito." });

    } catch (error) {
        await logger.error('ERROR_REGISTRO', `Error interno en registro: ${error.message}`);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// ==========================================
// RUTAS ARCO: ACCESO, RECTIFICACIÓN, CANCELACIÓN, OPOSICIÓN
// ==========================================
router.get('/profile', authMiddleware, async (req, res) => {
    return res.status(200).json({
        ok: true,
        message: 'Perfil obtenido correctamente',
        user: req.user,
    });
});

router.put('/profile', authMiddleware, [
    body('nombre')
        .optional()
        .trim()
        .isAlpha('es-ES', { ignore: ' ' })
        .withMessage('El nombre no debe contener números ni caracteres especiales.'),
    body('apellidos')
        .optional()
        .trim()
        .isAlpha('es-ES', { ignore: ' ' })
        .withMessage('Los apellidos no deben contener números ni caracteres especiales.'),
    body('correo')
        .optional()
        .trim()
        .isEmail()
        .withMessage('El correo no tiene un formato válido.')
        .normalizeEmail(),
    body('telefono')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('El teléfono celular solo debe contener números.')
        .isLength({ min: 10, max: 10 }).withMessage('El teléfono debe tener exactamente 10 dígitos.'),
], validationMiddleware, async (req, res) => {
    try {
        const { nombre, apellidos, correo, telefono } = req.body;
        const fields = [];
        const values = [];

        if (nombre) {
            fields.push('nombre = ?');
            values.push(nombre);
        }
        if (apellidos) {
            fields.push('apellidos = ?');
            values.push(apellidos);
        }
        if (correo) {
            fields.push('correo = ?');
            values.push(correo);
        }
        if (telefono !== undefined) {
            fields.push('telefono = ?');
            values.push(telefono || null);
        }

        if (fields.length === 0) {
            return res.status(400).json({ ok: false, message: 'No se proporcionaron datos para actualizar.' });
        }

        if (correo) {
            const [existing] = await db.promise().query('SELECT id FROM usuarios WHERE correo = ? AND id <> ?', [correo, req.user.id]);
            if (existing.length > 0) {
                return res.status(400).json({ ok: false, message: 'El correo electrónico ya está en uso por otro usuario.' });
            }
        }

        const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
        values.push(req.user.id);
        await db.promise().query(query, values);

        await logger.info('ARCO_RECTIFICACION', `Usuario con ID: ${req.user.id} actualizó su información personal.`);

        return res.status(200).json({ ok: true, message: 'Datos actualizados correctamente.' });
    } catch (error) {
        await logger.error('ERROR_ARCO_RECTIFICACION', `Error al rectificar datos: ${error.message}`);
        return res.status(500).json({ ok: false, message: 'Error interno al actualizar los datos.' });
    }
});

router.delete('/profile', authMiddleware, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM usuarios WHERE id = ?', [req.user.id]);
        await logger.info('ARCO_CANCELACION', `Usuario con ID: ${req.user.id} canceló su cuenta y solicitó eliminación.`);
        return res.status(200).json({ ok: true, message: 'Cuenta cancelada y datos eliminados.' });
    } catch (error) {
        await logger.error('ERROR_ARCO_CANCELACION', `Error al cancelar cuenta: ${error.message}`);
        return res.status(500).json({ ok: false, message: 'Error interno al cancelar la cuenta.' });
    }
});

router.post('/opposition', authMiddleware, async (req, res) => {
    try {
        await logger.info('ARCO_OPOSICION', `Usuario con ID: ${req.user.id} solicitó oposición al tratamiento de sus datos.`);
        return res.status(200).json({ ok: true, message: 'Solicitud de oposición registrada correctamente.' });
    } catch (error) {
        await logger.error('ERROR_ARCO_OPOSICION', `Error al procesar oposición: ${error.message}`);
        return res.status(500).json({ ok: false, message: 'Error interno al registrar la oposición.' });
    }
});

module.exports = router;