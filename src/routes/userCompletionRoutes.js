const userCompletionController = require('../controllers/userCompletionController');
const challengeController = require('../controllers/challengeController');
const userController = require('../controllers/userController');

const express = require('express');
const router = express.Router();

router.post('/',
    userCompletionController.checkNotCreator,
    userCompletionController.addCompletion,
    userCompletionController.addPointsToUser,
    userController.updateUserPointsById,
    challengeController.deleteChallengeById1
);
router.get('/', userCompletionController.readAllCompletions);
router.get('/:completion_id', userCompletionController.readCompletionById);
router.delete('/:id', userCompletionController.deleteCompletionById);

module.exports = router;
