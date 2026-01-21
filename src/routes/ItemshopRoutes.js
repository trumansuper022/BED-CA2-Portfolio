const express = require('express');
const router = express.Router();
const itemshopController = require('../controllers/itemshopController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');

router.get('/', itemshopController.readAllItemshop);
router.get('/:id', itemshopController.readItemshopById);
router.post('/', itemshopController.createNewItemshop);
router.put('/:id', itemshopController.updateItemshopById);
router.delete('/:id', itemshopController.deleteItemshopById);

router.post(
    '/buy',
    itemshopController.loadItemshopForBuy,
    userController.checkAndDeductPoints,
    inventoryController.addInventoryEntry,
    inventoryController.respondInventorySuccess
);

module.exports = router;
