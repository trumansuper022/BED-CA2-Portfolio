const express = require('express');
const router = express.Router();
const minepetController = require('../controllers/minePetController');

router.get('/', minepetController.readAllMinepet);
router.get('/:id', minepetController.readMinepetById);
router.post('/', minepetController.createNewMinepet);
router.put('/:id', minepetController.updateMinepetById);
router.delete('/:id', minepetController.deleteMinepetById);

module.exports = router;
