const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Item;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Item
        WHERE item_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Item (name, description, type, bonus_hp, bonus_atk, bonus_def)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const VALUES = [
        data.name,
        data.description,
        data.type,
        data.bonus_hp,
        data.bonus_atk,
        data.bonus_def
    ];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Item
        SET name = ?, description = ?, type = ?, bonus_hp = ?, bonus_atk = ?, bonus_def = ?
        WHERE item_id = ?;
    `;
    const VALUES = [
        data.name,
        data.description,
        data.type,
        data.bonus_hp,
        data.bonus_atk,
        data.bonus_def,
        data.id
    ];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Item
        WHERE item_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
