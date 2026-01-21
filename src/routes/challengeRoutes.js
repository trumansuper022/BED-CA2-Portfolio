const challengeController = require('../controllers/challengeController');

const express = require('express');
const router = express.Router();

router.get('/', challengeController.readAllChallenges);
router.post('/', challengeController.createChallenge);

router.get('/:id', challengeController.readChallengeById);
router.put('/:challenge_id', challengeController.updateChallengeById);
router.delete('/:id', challengeController.deleteChallengeById);

module.exports = router;
