const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.readAllUsers);
router.get('/:id', userController.readUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
