const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const userCompletionRoutes = require('./userCompletionRoutes');
const MobshopRoutes = require('./MobshopRoutes');
const itemshopRoutes = require('./ItemshopRoutes');
const minepetRoutes = require('./minePetRoutes');
const itemRoutes = require('./itemRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const fightRoutes = require('./FightRoutes');
const upgradeRoutes = require('./upgradeRoutes'); 

router.use('/inventory', inventoryRoutes);
router.use('/minepet', minepetRoutes);
router.use('/item', itemRoutes);
router.use('/itemshop', itemshopRoutes);
router.use('/user', userRoutes);
router.use('/challenge', challengeRoutes);
router.use('/usercompletion', userCompletionRoutes);
router.use('/mobshop', MobshopRoutes);
router.use('/fight', fightRoutes);
router.use('/upgrade', upgradeRoutes); 

module.exports = router;
