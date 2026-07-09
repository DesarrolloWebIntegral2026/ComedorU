const router = require('express').Router();
const logger = require('../utils/logger'); 
const db = require('../config/db'); 
const bcrypt = require('bcrypt'); 

// ==========================================
// RUTA DE INICIO DE SESIÓN (LOGIN)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscamos al usuario e incluimos su rol_id
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        const usuarioEncontrado = usuarios[0];
const express = require('express');
const { login, profile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const { loginLimiter } = require('../middlewares/rateLimit');

const validationMiddleware = require('../middlewares/validation.middleware');
const {
  validateLogin,
  validateRole,
} = require('../middlewares/security.validators');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  validateLogin,
  validateRole,
  validationMiddleware,
  login
);

        if (!usuarioEncontrado) {
            await logger.info('LOGIN_FALLIDO', `Intento de inicio de sesión rechazado para la cuenta: ${correo || 'No provista'}`);
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuarioEncontrado.password);
        
        if (!passwordCorrecto) {
            await logger.info('LOGIN_FALLIDO', `Contraseña incorrecta para la cuenta: ${correo}`);
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Mapeo informativo para la bitácora
        const nombreRol = usuarioEncontrado.rol_id === 1 ? 'Estudiante' : usuarioEncontrado.rol_id === 3 ? 'Vendedor' : 'Administrador';

        // AUDITORÍA EXITOSA (Issue #14)
        await logger.info('LOGIN_EXITOSO', `El usuario con ID: ${usuarioEncontrado.id} ha ingresado con el rol_id: ${usuarioEncontrado.rol_id} (${nombreRol})`);

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                correo: usuarioEncontrado.correo,
                rol_id: usuarioEncontrado.rol_id
            }
        });

    } catch (error) {
        await logger.error('ERROR_LOGIN', `Error en el servidor durante el proceso de login: ${error.message}`);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// ==========================================
// RUTA DE REGISTRO PÚBLICO (Mapeando a rol_id)
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { nombre, apellidos, correo, password, telefono, rol } = req.body;

        // Control de los roles del frontend mapeados a los IDs de tu tabla 'roles'
        const rolesPermitidos = ['Estudiante', 'Vendedor'];
        if (!rolesPermitidos.includes(rol)) {
            await logger.error('REGISTRO_RECHAZADO', `Intento de registro con un rol no autorizado: ${rol || 'Ninguno'}`);
            return res.status(400).json({ message: "El rol seleccionado no es válido." });
        }

        // MAPEO DE ROLES SEGÚN TU BASE DE DATOS:
        // Estudiante -> 1, Vendedor -> 3
        const rol_id = rol === 'Estudiante' ? 1 : 3;

        // Verificar si el correo ya existe
        const [usuariosExistentes] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado." });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);

        // Guardar usando exactamente los nombres de tus columnas: id, nombre, apellidos, correo, password, telefono, rol_id
        const queryInsert = 'INSERT INTO usuarios (nombre, apellidos, correo, password, telefono, rol_id) VALUES (?, ?, ?, ?, ?, ?)';
        const [resultado] = await db.query(queryInsert, [nombre, apellidos, correo, passwordEncriptado, telefono || null, rol_id]);

        // AUDITORÍA DE REGISTRO (Issue #14)
        await logger.info('REGISTRO_USUARIO', `Usuario nuevo creado exitosamente con ID: ${resultado.insertId} asignado al rol_id: ${rol_id} (${rol})`);

        return res.status(201).json({ message: "Usuario registrado con éxito." });

    } catch (error) {
        await logger.error('ERROR_REGISTRO', `Error interno en registro: ${error.message}`);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = router;