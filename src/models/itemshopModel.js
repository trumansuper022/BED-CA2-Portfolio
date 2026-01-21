const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT ISH.itemshop_id, ISH.price_points,
               IT.item_id, IT.name, IT.description, IT.type,
               IT.bonus_hp, IT.bonus_atk, IT.bonus_def
        FROM ItemShop ISH, Item IT
        WHERE ISH.item_id = IT.item_id;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT ISH.itemshop_id, ISH.price_points,
               IT.item_id, IT.name, IT.description, IT.type,
               IT.bonus_hp, IT.bonus_atk, IT.bonus_def
        FROM ItemShop ISH, Item IT
        WHERE ISH.itemshop_id = ? AND ISH.item_id = IT.item_id;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO ItemShop (item_id, price_points)
        VALUES (?, ?);
    `;
    const VALUES = [data.item_id, data.price_points];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE ItemShop
        SET item_id = ?, price_points = ?
        WHERE itemshop_id = ?;
    `;
    const VALUES = [data.item_id, data.price_points, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM ItemShop
        WHERE itemshop_id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
