const express = require('express');
const { login, profile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.get('/profile', authMiddleware, profile);

module.exports = router;