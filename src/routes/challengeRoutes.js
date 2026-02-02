const challengeController = require('../controllers/challengeController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require('express');
const router = express.Router();

router.get('/', challengeController.readAllChallenges);
router.post('/', jwtMiddleware.verifyToken, userController.verifyCrafterOwnership, challengeController.createChallenge);

router.get('/:id', challengeController.readChallengeById);
router.put('/:challenge_id', jwtMiddleware.verifyToken, challengeController.verifyChallengeOwnership, challengeController.updateChallengeById);
router.delete('/:id', jwtMiddleware.verifyToken, challengeController.verifyChallengeOwnership, challengeController.deleteChallengeById);

module.exports = router;
