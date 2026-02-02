const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM EvolvedMinepet;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM EvolvedMinepet
        WHERE evolved_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectByBaseId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM EvolvedMinepet
        WHERE base_minepet_id = ?;
    `;
    const VALUES = [data.base_minepet_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO EvolvedMinepet (base_minepet_id, name, description, base_hp, base_atk, base_def)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const VALUES = [
        data.base_minepet_id,
        data.name,
        data.description,
        data.base_hp,
        data.base_atk,
        data.base_def
    ];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE EvolvedMinepet
        SET base_minepet_id = ?, name = ?, description = ?, base_hp = ?, base_atk = ?, base_def = ?
        WHERE evolved_id = ?;
    `;
    const VALUES = [
        data.base_minepet_id,
        data.name,
        data.description,
        data.base_hp,
        data.base_atk,
        data.base_def,
        data.id
    ];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM EvolvedMinepet
        WHERE evolved_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
