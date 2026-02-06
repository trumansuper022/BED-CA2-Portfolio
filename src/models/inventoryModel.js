const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT 
            inv.inventory_id,
            inv.user_id,
            inv.minepet_id,
            NULL AS evolved_minepet_id,
            NULL AS item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def,
            inv.applied_item_id,
            inv.applied_items,
            mp.name AS minepet_name,
            mp.base_hp,
            mp.base_atk,
            mp.base_def,
            NULL AS evolved_name,
            NULL AS evolved_base_hp,
            NULL AS evolved_base_atk,
            NULL AS evolved_base_def,
            NULL AS item_name,
            NULL AS item_description,
            NULL AS item_bonus_hp,
            NULL AS item_bonus_atk,
            NULL AS item_bonus_def,
            (SELECT ap.name FROM Item ap WHERE ap.item_id = inv.applied_item_id) AS applied_item_name
        FROM Inventory inv, MinePet mp
        WHERE inv.minepet_id = mp.minepet_id

        UNION ALL

        SELECT 
            inv.inventory_id,
            inv.user_id,
            NULL AS minepet_id,
            em.evolved_id AS evolved_minepet_id,
            NULL AS item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def,
            inv.applied_item_id,
            inv.applied_items,
            NULL AS minepet_name,
            NULL AS base_hp,
            NULL AS base_atk,
            NULL AS base_def,
            em.name AS evolved_name,
            em.base_hp AS evolved_base_hp,
            em.base_atk AS evolved_base_atk,
            em.base_def AS evolved_base_def,
            NULL AS item_name,
            NULL AS item_description,
            NULL AS item_bonus_hp,
            NULL AS item_bonus_atk,
            NULL AS item_bonus_def,
            (SELECT ap.name FROM Item ap WHERE ap.item_id = inv.applied_item_id) AS applied_item_name
        FROM Inventory inv, EvolvedMinepet em
        WHERE inv.evolved_minepet_id = em.evolved_id

        UNION ALL

        SELECT 
            inv.inventory_id,
            inv.user_id,
            NULL AS minepet_id,
            NULL AS evolved_minepet_id,
            inv.item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def,
            inv.applied_item_id,
            inv.applied_items,
            NULL AS minepet_name,
            NULL AS base_hp,
            NULL AS base_atk,
            NULL AS base_def,
            NULL AS evolved_name,
            NULL AS evolved_base_hp,
            NULL AS evolved_base_atk,
            NULL AS evolved_base_def,
            it.name AS item_name,
            it.description AS item_description,
            it.bonus_hp AS item_bonus_hp,
            it.bonus_atk AS item_bonus_atk,
            it.bonus_def AS item_bonus_def,
            NULL AS applied_item_name
        FROM Inventory inv, Item it
        WHERE inv.item_id = it.item_id;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectAllByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            inv.inventory_id,
            inv.user_id,
            inv.minepet_id,
            inv.evolved_minepet_id,
            inv.item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def,
            inv.applied_item_id,
            inv.applied_items,
            mp.name AS minepet_name,
            mp.base_hp,
            mp.base_atk,
            mp.base_def,
            NULL AS evolved_name,
            NULL AS evolved_base_hp,
            NULL AS evolved_base_atk,
            NULL AS evolved_base_def,
            NULL AS item_name,
            NULL AS item_description,
            NULL AS item_bonus_hp,
            NULL AS item_bonus_atk,
            NULL AS item_bonus_def,
            (SELECT ap.name FROM Item ap WHERE ap.item_id = inv.applied_item_id) AS applied_item_name
        FROM Inventory inv, MinePet mp
        WHERE inv.minepet_id = mp.minepet_id
        AND inv.user_id = ?

        UNION ALL

        SELECT 
            inv.inventory_id,
            inv.user_id,
            NULL AS minepet_id,
            em.evolved_id AS evolved_minepet_id,
            NULL AS item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def,
            inv.applied_item_id,
            inv.applied_items,
            NULL AS minepet_name,
            NULL AS base_hp,
            NULL AS base_atk,
            NULL AS base_def,
            em.name AS evolved_name,
            em.base_hp AS evolved_base_hp,
            em.base_atk AS evolved_base_atk,
            em.base_def AS evolved_base_def,
            NULL AS item_name,
            NULL AS item_description,
            NULL AS item_bonus_hp,
            NULL AS item_bonus_atk,
            NULL AS item_bonus_def,
            (SELECT ap.name FROM Item ap WHERE ap.item_id = inv.applied_item_id) AS applied_item_name
        FROM Inventory inv, EvolvedMinepet em
        WHERE inv.evolved_minepet_id = em.evolved_id
        AND inv.user_id = ?

        UNION ALL

        SELECT 
            inv.inventory_id,
            inv.user_id,
            NULL AS minepet_id,
            NULL AS evolved_minepet_id,
            inv.item_id,
            inv.quantity,
            inv.bonus_hp,
            inv.bonus_atk,
            inv.bonus_def,
            inv.applied_item_id,
            inv.applied_items,
            NULL AS minepet_name,
            NULL AS base_hp,
            NULL AS base_atk,
            NULL AS base_def,
            NULL AS evolved_name,
            NULL AS evolved_base_hp,
            NULL AS evolved_base_atk,
            NULL AS evolved_base_def,
            it.name AS item_name,
            it.description AS item_description,
            it.bonus_hp AS item_bonus_hp,
            it.bonus_atk AS item_bonus_atk,
            it.bonus_def AS item_bonus_def,
            NULL AS applied_item_name
        FROM Inventory inv, Item it
        WHERE inv.item_id = it.item_id
        AND inv.user_id = ?;
    `;
    const VALUES = [data.user_id, data.user_id, data.user_id];

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
        INSERT INTO Inventory (user_id, minepet_id, evolved_minepet_id, item_id, quantity)
        VALUES (?, ?, ?, ?, 1);
    `;
    const VALUES = [data.user_id, data.minepet_id, data.evolved_minepet_id || null, data.item_id];
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

module.exports.updateBonusesAndAppliedItem = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Inventory
        SET bonus_hp = ?, bonus_atk = ?, bonus_def = ?, applied_item_id = ?, applied_items = ?
        WHERE inventory_id = ?;
    `;
    const VALUES = [
        data.bonushp,
        data.bonusatk,
        data.bonusdef,
        data.applied_item_id,
        data.applied_items,
        data.inventoryid
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
