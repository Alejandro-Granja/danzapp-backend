const express = require('express');
const router = express.Router();
const { getComentariosByDanza, createComentario } = require('../controllers/comentarioController');
const requireRole = require('../middlewares/authMiddleware');

// 📌 Obtener comentarios de una danza
router.get('/danza/:danza_id', getComentariosByDanza);

// 📌 Crear un comentario (usuario autenticado: público, investigador o admin)
router.post(
  '/danza/:danza_id',
  requireRole(['publico', 'investigador', 'admin']),
  createComentario
);

module.exports = router;
