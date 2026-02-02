const authModel = require('../models/authModel');
const userModel = require('../models/userModel');

// Validate register fields early to keep responses clear
module.exports.validateRegisterFields = (req, res, next) => {
  const requiredFields = ['username', 'email', 'password'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (req.body[field] === undefined || req.body[field] === '') {
      res.status(400).json({ message: `${field} is undefined or empty` });
      return;
    }
  }

  next();
};

// Validate login fields (username or email is allowed)
module.exports.validateLoginFields = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if ((!username && !email) || !password) {
    res.status(400).json({ message: 'username/email or password is undefined' });
    return;
  }

  next();
};

// Check username/email duplicates before registering
module.exports.checkUsernameOrEmailExist = (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email
  };

  const callback = (error, results) => {
    if (error) {
      console.error('Error checkUsernameOrEmailExist:', error);
      res.status(500).json(error);
      return;
    }

    if (results.length !== 0) {
      res.status(409).json({ message: 'Username or email already exists' });
      return;
    }

    next();
  };

  authModel.readUserByEmailOrUsername(data, callback);
};

// Register user with hashed password
module.exports.register = (req, res, next) => {
  const data = {
    email: req.body.email,
    username: req.body.username,
    password: res.locals.hash
  };

  const callback = (error, results) => {
    if (error) {
      console.error('Error register:', error);
      res.status(500).json(error);
      return;
    }

    res.locals.userId = results.insertId;
    res.locals.username = req.body.username;
    res.locals.message = 'Register success';
    next();
  };

  authModel.register(data, callback);
};

// Load user for login and expose hash for bcrypt
module.exports.loadUserForLogin = (req, res, next) => {
  const data = {
    username: req.body.username || null,
    email: req.body.email || null
  };

  const callback = (error, results) => {
    if (error) {
      console.error('Error loadUserForLogin:', error);
      res.status(500).json(error);
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = results[0];
    res.locals.hash = user.password;
    res.locals.userId = user.user_id;
    res.locals.username = user.username;
    res.locals.message = 'Login success';
    next();
  };

  authModel.readUserForLogin(data, callback);
};

// Simple profile fetch using token userId
module.exports.readProfileByToken = (req, res, next) => {
  const dataUser = { user_id: res.locals.userId };

  const callbackUser = (errorUser, resultsUser) => {
    if (errorUser) {
      console.error('Error readProfileByToken (user):', errorUser);
      res.status(500).json(errorUser);
      return;
    }

    if (resultsUser.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const authUser = resultsUser[0];
    const dataPlayers = { owner_user_id: res.locals.userId };

    const callbackPlayers = (errorPlayers, resultsPlayers) => {
      if (errorPlayers) {
        console.error('Error readProfileByToken (players):', errorPlayers);
        res.status(500).json(errorPlayers);
        return;
      }

      res.status(200).json({
        user_id: authUser.user_id,
        username: authUser.username,
        email: authUser.email,
        players: resultsPlayers
      });
    };

    userModel.selectAllByOwner(dataPlayers, callbackPlayers);
  };

  authModel.readUserById(dataUser, callbackUser);
};
