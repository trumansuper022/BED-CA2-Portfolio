const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, points, owner_user_id
        FROM Crafters;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectAllByOwner = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, points, owner_user_id
        FROM Crafters
        WHERE owner_user_id = ?;
    `;
    const VALUES = [data.owner_user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectFirstByOwner = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, points, owner_user_id
        FROM Crafters
        WHERE owner_user_id = ?
        ORDER BY user_id ASC
        LIMIT 1;
    `;
    const VALUES = [data.owner_user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, points, owner_user_id
        FROM Crafters
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Crafters (username, points, owner_user_id)
        VALUES (?, 0, ?);
    `;
    const VALUES = [data.username, data.owner_user_id || null];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Crafters
        SET username = ?, points = ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.points, data.userid];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Crafters
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.incrementUserPoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Crafters
        SET points = points + ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.pointsToAdd, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deductUserPoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Crafters
        SET points = points - ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.pointsToDeduct, data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
