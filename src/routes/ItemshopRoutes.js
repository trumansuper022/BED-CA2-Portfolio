const express = require('express');
const router = express.Router();
const itemshopController = require('../controllers/itemshopController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', itemshopController.readAllItemshop);
router.get('/:id', itemshopController.readItemshopById);
router.post('/', jwtMiddleware.verifyToken, itemshopController.createNewItemshop);
router.put('/:id', jwtMiddleware.verifyToken, itemshopController.updateItemshopById);
router.delete('/:id', jwtMiddleware.verifyToken, itemshopController.deleteItemshopById);

router.post(
    '/buy',
    jwtMiddleware.verifyToken,
    itemshopController.loadItemshopForBuy,
    userController.checkAndDeductPoints,
    inventoryController.addInventoryEntry,
    inventoryController.respondInventorySuccess
);

module.exports = router;
