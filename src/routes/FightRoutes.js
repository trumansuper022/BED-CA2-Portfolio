const express = require('express');
const router = express.Router();

const fightController = require('../controllers/FightController');
const userController = require('../controllers/userController');

router.post(
  '/',
  fightController.simpleStatFight,
  userController.addWinPoints
);

module.exports = router;
