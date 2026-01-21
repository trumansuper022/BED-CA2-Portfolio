const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Inventory;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectAllByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            inv.inventory_id,
            inv.user_id,
            inv.minepet_id,
            inv.item_id,
            inv.quantity,
            mp.name,
            mp.base_hp,
            mp.base_atk,
            mp.base_def,
            it.name,
            it.description
        FROM Inventory inv, MinePet mp, Item it
        WHERE inv.user_id = ?
          AND (inv.minepet_id = mp.minepet_id OR inv.item_id = it.item_id);
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM inventory
        WHERE inventory_id = ?;
    `;
    const VALUES = [data.inventory_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Inventory (user_id, minepet_id, item_id, quantity)
        VALUES (?, ?, ?, 1);
    `;
    const VALUES = [data.user_id, data.minepet_id, data.item_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Inventory
        WHERE inventory_id = ?;
    `;
    const VALUES = [data.inventoryid];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
