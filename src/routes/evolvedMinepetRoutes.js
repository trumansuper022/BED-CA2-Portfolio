const express = require('express');
const router = express.Router();

const evolvedController = require('../controllers/evolvedMinepetController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', evolvedController.readAllEvolved);
router.get('/base/:base_id', evolvedController.readEvolvedByBase);
router.get('/:id', evolvedController.readEvolvedById);
router.post('/', jwtMiddleware.verifyToken, evolvedController.createEvolved);
router.put('/:id', jwtMiddleware.verifyToken, evolvedController.updateEvolvedById);
router.delete('/:id', jwtMiddleware.verifyToken, evolvedController.deleteEvolvedById);

module.exports = router;
