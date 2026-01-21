const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT challenge_id, creator_id, description, points
        FROM WellnessChallenge;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT challenge_id, creator_id, description, points
        FROM WellnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO WellnessChallenge (creator_id, description, points)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.creator_id, data.description, data.points];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE WellnessChallenge
        SET description = ?, points = ?
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.description, data.points, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM WellnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
