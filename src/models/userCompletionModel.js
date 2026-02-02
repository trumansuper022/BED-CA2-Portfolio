const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT completion_id, challenge_id, user_id, details
        FROM UserCompletion;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT completion_id, challenge_id, user_id, details
        FROM UserCompletion
        WHERE completion_id = ?;
    `;
    const VALUES = [data.completion_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, details)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.user_id, data.details];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM UserCompletion
        WHERE completion_id = ?;
    `;
    const VALUES = [data.completion_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
