const pool = require('../services/db');

module.exports.selectInventoryWithMobAndStatsById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            inv.inventory_id,
            inv.user_id,
            inv.minepet_id,
            inv.item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def
        FROM Inventory inv
        WHERE inv.inventory_id = ?;
    `;
    const VALUES = [data.inventory_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateInventoryBonuses = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Inventory
        SET bonus_hp = ?, bonus_atk = ?, bonus_def = ?
        WHERE inventory_id = ?;
    `;
    const VALUES = [
        data.bonushp,
        data.bonusatk,
        data.bonusdef,
        data.inventoryid
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
