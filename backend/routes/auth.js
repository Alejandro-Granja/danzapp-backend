const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireRole = require('../middlewares/authMiddleware');

// 👉 Registro de usuario (público)
router.post('/register', authController.register);

// 👉 Inicio de sesión (devuelve token JWT)
router.post('/login', authController.login);

// 👉 Cambiar contraseña personal (usuario autenticado)
router.put('/users/:id/password', requireRole(['publico', 'investigador', 'admin']), authController.changePassword);

// 👉 Forzar cambio de contraseña (solo admin)
router.put('/users/:id/force-password', requireRole(['admin']), authController.forceChangePassword);

module.exports = router;
