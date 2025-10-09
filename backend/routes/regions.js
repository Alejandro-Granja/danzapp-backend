const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);
router.post('/', regionController.createRegion);
router.put('/:id', regionController.updateRegion);
router.delete('/:id', regionController.deleteRegion);

module.exports = router;
