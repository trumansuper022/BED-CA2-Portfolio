const express = require('express');
const router = express.Router();

const upgradeController = require('../controllers/upgradeController.js');
const userController = require('../controllers/userController.js');

router.post(
    '/',
    upgradeController.loadUpgradeTarget,
    upgradeController.setNormalUpgradePrice,
    userController.checkAndDeductPoints,
    upgradeController.applyNormalUpgrade
);

router.post(
    '/gamble',
    upgradeController.loadUpgradeTarget,
    upgradeController.setGamblePrice,
    userController.checkAndDeductPoints,
    upgradeController.applyGambleUpgrade
);

module.exports = router;
