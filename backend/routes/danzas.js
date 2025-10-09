const express = require('express');
const router = express.Router();
const danzaController = require('../controllers/danzasController'); // nombre igual al archivo

router.get('/', danzaController.getAllDanzas);
router.get('/:id', danzaController.getDanzaById);
router.post('/', danzaController.createDanza);
router.put('/:id', danzaController.updateDanza);
router.delete('/:id', danzaController.deleteDanza);

module.exports = router;
