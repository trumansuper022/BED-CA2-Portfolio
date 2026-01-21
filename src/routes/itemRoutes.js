const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.readAllItem);
router.get('/:id', itemController.readItemById);
router.post('/', itemController.createNewItem);
router.put('/:id', itemController.updateItemById);
router.delete('/:id', itemController.deleteItemById);

module.exports = router;
