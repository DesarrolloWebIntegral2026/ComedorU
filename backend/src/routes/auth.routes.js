const express = require('express');
const { login, profile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const {
  validateLogin,
  validateRole,
} = require('../middlewares/security.validators');

const router = express.Router();

router.post('/login', validateLogin, validateRole, validationMiddleware, login);
router.get('/profile', authMiddleware, profile);

module.exports = router;