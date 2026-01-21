const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM MinePet;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM MinePet
        WHERE minepet_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO MinePet (name, description, base_hp, base_atk, base_def)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [
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
        UPDATE MinePet
        SET name = ?, description = ?, base_hp = ?, base_atk = ?, base_def = ?
        WHERE minepet_id = ?;
    `;
    const VALUES = [
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
        DELETE FROM MinePet
        WHERE minepet_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
