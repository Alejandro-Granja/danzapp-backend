const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireRole = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/users/:id/password', requireRole(['publico', 'investigador', 'admin']), authController.changePassword);
router.put('/users/:id/force-password', requireRole(['admin']), authController.forceChangePassword);

module.exports = router;
