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

router.get('/profile', authMiddleware, profile);

module.exports = router;