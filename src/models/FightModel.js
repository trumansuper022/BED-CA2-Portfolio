const pool = require('../services/db');

module.exports.selectTwoPetsById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT minepet_id, name, base_hp, base_atk, base_def
        FROM MinePet
        WHERE minepet_id IN (?, ?);
    `;
    const VALUES = [data.attacker_minepet_id, data.defender_minepet_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertFight = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Fight (attacker_id, defender_id, winner_id, is_finished)
        VALUES (?, ?, ?, 1);
    `;
    const VALUES = [data.attacker_id, data.defender_id, data.winner_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
