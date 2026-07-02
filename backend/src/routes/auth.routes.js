const express = require('express');
const { login, profile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// ─── IMPORTAR EL MIDDLEWARE DE RATE LIMIT ───
const { loginLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

// Aplicar loginLimiter exclusivamente aquí para cumplir la Issue #13
router.post('/login', loginLimiter, login);

router.get('/profile', authMiddleware, profile);

module.exports = router;
