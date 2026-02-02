const pool = require('../services/db');

// Check if a user already exists by email or username
module.exports.readUserByEmailOrUsername = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, username, email
    FROM Users
    WHERE email = ? OR username = ?;
  `;
  const VALUES = [data.email, data.username];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Register a new user with hashed password
module.exports.register = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Users (email, username, password)
    VALUES (?, ?, ?);
  `;
  const VALUES = [data.email, data.username, data.password];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Fetch user by username or email for login
module.exports.readUserForLogin = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, username, email, password
    FROM Users
    WHERE (username = ? OR email = ?)
    LIMIT 1;
  `;
  const VALUES = [data.username, data.email];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.readUserById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, username, email
    FROM Users
    WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
