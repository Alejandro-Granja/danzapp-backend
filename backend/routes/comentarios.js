const express = require('express');
const router = express.Router();
const { 
  getComentariosByDanza, 
  createComentario,
  deleteComentario   
} = require('../controllers/comentarioController');
const requireRole = require('../middlewares/authMiddleware');

router.get('/danza/:danza_id', getComentariosByDanza);
router.post('/danza/:danza_id', requireRole(['publico', 'investigador', 'admin']), createComentario);
router.delete('/:comentario_id', requireRole(['admin']), deleteComentario); 

module.exports = router;
