const pool = require('../services/db');

module.exports.selectTwoPetsByInventoryId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            inv.inventory_id,
            inv.minepet_id,
            NULL AS evolved_minepet_id,
            mp.name,
            mp.base_hp,
            mp.base_atk,
            mp.base_def
        FROM Inventory inv, MinePet mp
        WHERE inv.minepet_id = mp.minepet_id
        AND inv.inventory_id IN (?, ?)

        UNION

        SELECT 
            inv.inventory_id,
            NULL AS minepet_id,
            em.evolved_id AS evolved_minepet_id,
            em.name,
            em.base_hp,
            em.base_atk,
            em.base_def
        FROM Inventory inv, EvolvedMinepet em
        WHERE inv.evolved_minepet_id = em.evolved_id
        AND inv.inventory_id IN (?, ?);
    `;
    const VALUES = [
        data.attacker_inventory_id,
        data.defender_inventory_id,
        data.attacker_inventory_id,
        data.defender_inventory_id
    ];

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

module.exports.selectFightHistory = (callback) => {
    const SQLSTATEMENT = `
        SELECT 
            f.fight_id,
            f.attacker_id,
            a.username AS attacker_name,
            f.defender_id,
            d.username AS defender_name,
            f.winner_id,
            w.username AS winner_name,
            f.created_at
        FROM Fight f, Crafters a, Crafters d, Crafters w
        WHERE f.attacker_id = a.user_id
        AND f.defender_id = d.user_id
        AND f.winner_id = w.user_id
        ORDER BY f.fight_id DESC;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.selectWinCounters = (callback) => {
    const SQLSTATEMENT = `
        SELECT player_id, player_name, opponent_id, opponent_name, COUNT(*) AS wins
        FROM (
            SELECT 
                f.winner_id AS player_id,
                w.username AS player_name,
                f.defender_id AS opponent_id,
                o.username AS opponent_name
            FROM Fight f, Crafters w, Crafters o
            WHERE f.winner_id = w.user_id
            AND f.defender_id = o.user_id
            AND f.winner_id = f.attacker_id

            UNION ALL

            SELECT 
                f.winner_id AS player_id,
                w.username AS player_name,
                f.attacker_id AS opponent_id,
                o.username AS opponent_name
            FROM Fight f, Crafters w, Crafters o
            WHERE f.winner_id = w.user_id
            AND f.attacker_id = o.user_id
            AND f.winner_id = f.defender_id
        ) AS wins
        GROUP BY player_id, player_name, opponent_id, opponent_name
        ORDER BY player_id, wins DESC;
    `;
    pool.query(SQLSTATEMENT, callback);
};
