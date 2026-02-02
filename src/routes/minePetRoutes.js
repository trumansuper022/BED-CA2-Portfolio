const express = require('express');
const router = express.Router();
const minepetController = require('../controllers/minePetController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', minepetController.readAllMinepet);
router.get('/:id', minepetController.readMinepetById);
router.post('/', jwtMiddleware.verifyToken, minepetController.createNewMinepet);
router.put('/:id', jwtMiddleware.verifyToken, minepetController.updateMinepetById);
router.delete('/:id', jwtMiddleware.verifyToken, minepetController.deleteMinepetById);

module.exports = router;
