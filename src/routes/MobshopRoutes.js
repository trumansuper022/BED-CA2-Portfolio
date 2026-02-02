const express = require('express');
const router = express.Router();
const MobshopController = require('../controllers/MobshopController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', MobshopController.readAllmobShop);
router.get('/:id', MobshopController.readmobShopById);
router.post('/', jwtMiddleware.verifyToken, MobshopController.createNewmobShop);
router.put('/:id', jwtMiddleware.verifyToken, MobshopController.updatemobShopById);
router.delete('/:id', jwtMiddleware.verifyToken, MobshopController.deletemobShopById);

router.post(
    '/buy',
    jwtMiddleware.verifyToken,
    MobshopController.loadMobshopForBuy,
    userController.checkAndDeductPoints,
    inventoryController.addInventoryEntry,
    inventoryController.respondInventorySuccess
);

module.exports = router;
