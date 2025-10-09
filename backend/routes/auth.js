const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/users/:id/password', authController.changePassword);
router.put('/users/:id/force-password', authController.forceChangePassword);

module.exports = router;
