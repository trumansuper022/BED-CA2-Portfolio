const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Register flow (example from class: controller -> bcrypt -> register -> jwt)
router.post(
  '/register',
  authController.validateRegisterFields,
  authController.checkUsernameOrEmailExist,
  bcryptMiddleware.hashPassword,
  authController.register,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

// Login flow (lookup user -> compare password -> jwt)
router.post(
  '/login',
  authController.validateLoginFields,
  authController.loadUserForLogin,
  bcryptMiddleware.comparePassword,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

// Basic profile route (token required)
router.get('/profile', jwtMiddleware.verifyToken, authController.readProfileByToken);

module.exports = router;
