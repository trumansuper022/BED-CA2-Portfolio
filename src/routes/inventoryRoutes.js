const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/user/:user_id', jwtMiddleware.verifyToken, inventoryController.readAllInventoryByUserId);
router.get('/:inventory_id', jwtMiddleware.verifyToken, inventoryController.readInventoryById);
router.get('/', jwtMiddleware.verifyToken, inventoryController.readAllInventory);
router.post('/', jwtMiddleware.verifyToken, inventoryController.createNewInventory);
router.post('/apply-item', jwtMiddleware.verifyToken, inventoryController.applyItemToMinepet);
router.delete('/:inventory_id', jwtMiddleware.verifyToken, inventoryController.deleteInventoryById);

module.exports = router;
