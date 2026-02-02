const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', userController.readAllUsers);
router.get('/mine', jwtMiddleware.verifyToken, userController.readMyPlayers);
router.get('/:id', userController.readUserById);
router.post('/', jwtMiddleware.verifyToken, userController.createUser);
router.put('/:id', jwtMiddleware.verifyToken, userController.updateUserById);
router.delete('/:id', jwtMiddleware.verifyToken, userController.deleteUserById);

module.exports = router;
