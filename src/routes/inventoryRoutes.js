const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/user/:user_id', inventoryController.readAllInventoryByUserId);
router.get('/:inventory_id', inventoryController.readInventoryById);
router.get('/', inventoryController.readAllInventory);
router.post('/', inventoryController.createNewInventory);
router.delete('/:inventory_id', inventoryController.deleteInventoryById);

module.exports = router;
