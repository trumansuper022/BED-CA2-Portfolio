const express = require('express');
const router = express.Router();
const MobshopController = require('../controllers/MobshopController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');

router.get('/', MobshopController.readAllmobShop);
router.get('/:id', MobshopController.readmobShopById);
router.post('/', MobshopController.createNewmobShop);
router.put('/:id', MobshopController.updatemobShopById);
router.delete('/:id', MobshopController.deletemobShopById);

router.post(
    '/buy',
    MobshopController.loadMobshopForBuy,
    userController.checkAndDeductPoints,
    inventoryController.addInventoryEntry,
    inventoryController.respondInventorySuccess
);

module.exports = router;
