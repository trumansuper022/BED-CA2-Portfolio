const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT MS.mobshop_id, MS.price_points,
               MP.minepet_id, MP.name, MP.description,
               MP.base_hp, MP.base_atk, MP.base_def
        FROM MobShop MS, MinePet MP
        WHERE MS.minepet_id = MP.minepet_id;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT MS.mobshop_id, MS.price_points,
               MP.minepet_id, MP.name, MP.description,
               MP.base_hp, MP.base_atk, MP.base_def
        FROM MobShop MS, MinePet MP
        WHERE MS.mobshop_id = ? AND MS.minepet_id = MP.minepet_id;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO MobShop (minepet_id, price_points)
        VALUES (?, ?);
    `;
    const VALUES = [data.minepet_id, data.price_points];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE MobShop
        SET minepet_id = ?, price_points = ?
        WHERE mobshop_id = ?;
    `;
    const VALUES = [data.minepet_id, data.price_points, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM MobShop
        WHERE mobshop_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
