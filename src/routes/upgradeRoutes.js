const express = require('express');
const router = express.Router();

const upgradeController = require('../controllers/upgradeController.js');
const userController = require('../controllers/userController.js');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.post(
    '/',
    jwtMiddleware.verifyToken,
    upgradeController.loadUpgradeTarget,
    upgradeController.setNormalUpgradePrice,
    userController.checkAndDeductPoints,
    upgradeController.applyNormalUpgrade
);

router.post(
    '/gamble',
    jwtMiddleware.verifyToken,
    upgradeController.loadUpgradeTarget,
    upgradeController.setGamblePrice,
    userController.checkAndDeductPoints,
    upgradeController.applyGambleUpgrade
);

router.post(
    '/evolve',
    jwtMiddleware.verifyToken,
    upgradeController.evolveMinepet
);

module.exports = router;
