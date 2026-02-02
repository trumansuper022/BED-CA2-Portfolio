const express = require('express');
const router = express.Router();

const fightController = require('../controllers/FightController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/history', fightController.readFightHistory);
router.get('/wins', fightController.readWinCounters);

router.post(
  '/',
  jwtMiddleware.verifyToken,
  fightController.simpleStatFight,
  userController.addWinPoints
);

module.exports = router;
