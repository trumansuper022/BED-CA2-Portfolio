const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', itemController.readAllItem);
router.get('/:id', itemController.readItemById);
router.post('/', jwtMiddleware.verifyToken, itemController.createNewItem);
router.put('/:id', jwtMiddleware.verifyToken, itemController.updateItemById);
router.delete('/:id', jwtMiddleware.verifyToken, itemController.deleteItemById);

module.exports = router;
