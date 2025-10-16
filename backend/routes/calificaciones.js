const express = require('express');
const router = express.Router();
const {
  getRatingByIdDanza,
  getRatingById,
  createRating,
  updateRating,
  deleteRating
} = require('../controllers/calificacionController');
const requireRole = require('../middlewares/authMiddleware');

router.get('/danza/:danza_id', getRatingByIdDanza);
router.get('/:calificacion_id', getRatingById);
router.post('/danza/:danza_id', requireRole(['publico', 'investigador', 'admin']), createRating);
router.put('/:calificacion_id', requireRole(['publico', 'investigador', 'admin']), updateRating);
router.delete('/:calificacion_id', requireRole(['publico', 'investigador', 'admin']), deleteRating);

module.exports = router;
