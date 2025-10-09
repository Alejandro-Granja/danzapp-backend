const express = require('express');
const router = express.Router();
const { createRating, getRatingByIdDanza } = require('../controllers/calificacionController');
const requireRole = require('../middlewares/authMiddleware');

// 📌 Obtener calificaciones de una danza
router.get('/danza/:danza_id', getRatingByIdDanza);

// 📌 Crear calificación para una danza (usuario autenticado: público, investigador o admin)
router.post('/danza/:danza_id', requireRole(['publico', 'investigador', 'admin']), createRating);

module.exports = router;
