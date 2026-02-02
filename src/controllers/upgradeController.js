const upgradeModel = require('../models/upgradeModel.js');

const NORMAL_UPGRADE_COST = 50;
const NORMAL_UPGRADE_AMOUNT = 2;
const GAMBLE_COST = 200;
const GAMBLE_MIN = -5;
const GAMBLE_MAX = 10;

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.setNormalUpgradePrice = (req, res, next) => {
    req.priceToPay = NORMAL_UPGRADE_COST;
    next();
};

module.exports.setGamblePrice = (req, res, next) => {
    req.priceToPay = GAMBLE_COST;
    next();
};

module.exports.loadUpgradeTarget = (req, res, next) => {
    const userid = req.body.user_id;
    const inventoryid = req.body.inventory_id;

    if (userid === undefined || inventoryid === undefined) {
        res.status(400).json({ message: "Error: userid or inventoryid is undefined" });
        return;
    }

    const dataInv = { inventory_id: inventoryid };

    const cbInv = (errorInv, rowsInv, fieldsInv) => {
        if (errorInv) {
            console.error("Error loadUpgradeTarget select inventory:", errorInv);
            res.status(500).json(errorInv);
            return;
        }

        if (rowsInv.length === 0) {
            res.status(404).json({ message: "Inventory entry not found" });
            return;
        }

        const inv = rowsInv[0];

        if (inv.user_id !== userid) {
            res.status(403).json({ message: "This mob does not belong to the user" });
            return;
        }

        if (inv.minepet_id === null && inv.evolved_minepet_id === null) {
            res.status(400).json({ message: "Inventory entry does not contain a mob" });
            return;
        }

        req.inventory = inv;
        next();
    };

    upgradeModel.selectInventoryWithMobAndStatsById(dataInv, cbInv);
};

module.exports.applyNormalUpgrade = (req, res, next) => {
    const stat = req.body.stat;

    if (stat === undefined) {
        res.status(400).json({ message: "Error: stat is undefined" });
        return;
    }

    if (stat !== "hp" && stat !== "atk" && stat !== "def") {
        res.status(400).json({ message: "Error: stat must be hp, atk or def" });
        return;
    }

    const inv = req.inventory;

    let newBonusHp = inv.bonus_hp || 0;
    let newBonusAtk = inv.bonus_atk || 0;
    let newBonusDef = inv.bonus_def || 0;

    if (stat === "hp") {
        newBonusHp = newBonusHp + NORMAL_UPGRADE_AMOUNT;
    } else if (stat === "atk") {
        newBonusAtk = newBonusAtk + NORMAL_UPGRADE_AMOUNT;
    } else if (stat === "def") {
        newBonusDef = newBonusDef + NORMAL_UPGRADE_AMOUNT;
    }

    const dataInvUpdate = {
        inventoryid: inv.inventory_id,
        bonushp: newBonusHp,
        bonusatk: newBonusAtk,
        bonusdef: newBonusDef
    };

    const cbInvUpdate = (errorUpd, resultsUpd, fieldsUpd) => {
        if (errorUpd) {
            console.error("Error applyNormalUpgrade update inventory:", errorUpd);
            res.status(500).json(errorUpd);
            return;
        }

        res.status(200).json({
            message: "Mob upgraded successfully",
            inventoryid: inv.inventory_id,
            minepetid: inv.minepet_id,
            upgradedstat: stat,
            upgradeamount: NORMAL_UPGRADE_AMOUNT,
            pointsspent: NORMAL_UPGRADE_COST,
            newbonushp: newBonusHp,
            newbonusatk: newBonusAtk,
            newbonusdef: newBonusDef
        });
    };

    upgradeModel.updateInventoryBonuses(dataInvUpdate, cbInvUpdate);
};

module.exports.applyGambleUpgrade = (req, res, next) => {
    const inv = req.inventory;

    const deltaHp = randomInt(GAMBLE_MIN, GAMBLE_MAX);
    const deltaAtk = randomInt(GAMBLE_MIN, GAMBLE_MAX);
    const deltaDef = randomInt(GAMBLE_MIN, GAMBLE_MAX);

    const newBonusHp = (inv.bonus_hp || 0) + deltaHp;
    const newBonusAtk = (inv.bonus_atk || 0) + deltaAtk;
    const newBonusDef = (inv.bonus_def || 0) + deltaDef;

    const dataInvUpdate = {
        inventoryid: inv.inventory_id,
        bonushp: newBonusHp,
        bonusatk: newBonusAtk,
        bonusdef: newBonusDef
    };

    const cbInvUpdate = (errorUpd, resultsUpd, fieldsUpd) => {
        if (errorUpd) {
            console.error("Error applyGambleUpgrade update inventory:", errorUpd);
            res.status(500).json(errorUpd);
            return;
        }

        res.status(200).json({
            message: "Gamble upgrade completed",
            inventoryid: inv.inventory_id,
            minepetid: inv.minepet_id,
            deltas: {
                hp: deltaHp,
                atk: deltaAtk,
                def: deltaDef
            },
            newbonushp: newBonusHp,
            newbonusatk: newBonusAtk,
            newbonusdef: newBonusDef,
            pointsspent: GAMBLE_COST
        });
    };

    upgradeModel.updateInventoryBonuses(dataInvUpdate, cbInvUpdate);
};

// Evolution mechanic: use Nether Star to evolve a minepet
module.exports.evolveMinepet = (req, res, next) => {
    const user_id = Number(req.body.user_id);
    const minepet_inventory_id = Number(req.body.minepet_inventory_id);
    const evolved_id = Number(req.body.evolved_id);
    const nether_star_inventory_id = Number(req.body.nether_star_inventory_id);
    const isAdmin = res.locals.userId === 1;

    if (!user_id || !minepet_inventory_id || !evolved_id || !nether_star_inventory_id) {
        res.status(400).json({ message: "Error: user_id, minepet_inventory_id, evolved_id or nether_star_inventory_id is undefined" });
        return;
    }

    const inventoryModel = require('../models/inventoryModel.js');
    const evolvedModel = require('../models/EvolvedMinepetModel.js');
    const itemModel = require('../models/itemModel.js');

    const cbMinepetInv = (errorInv, rowsInv) => {
        if (errorInv) {
            console.error("Error evolveMinepet (minepet inventory):", errorInv);
            res.status(500).json(errorInv);
            return;
        }
        if (rowsInv.length === 0) {
            res.status(404).json({ message: "Minepet inventory entry not found" });
            return;
        }

        const inv = rowsInv[0];
        if (!isAdmin && inv.user_id !== user_id) {
            res.status(403).json({ message: "Minepet inventory entry does not belong to user" });
            return;
        }
        if (inv.minepet_id == null) {
            res.status(400).json({ message: "Selected inventory entry is not a base minepet" });
            return;
        }

        const cbEvolved = (errorE, rowsE) => {
            if (errorE) {
                console.error("Error evolveMinepet (evolved):", errorE);
                res.status(500).json(errorE);
                return;
            }
            if (rowsE.length === 0) {
                res.status(404).json({ message: "Evolved minepet not found" });
                return;
            }

            const evo = rowsE[0];
            if (evo.base_minepet_id !== inv.minepet_id) {
                res.status(400).json({ message: "Evolution does not match base minepet" });
                return;
            }

            const cbStarInv = (errorStar, rowsStar) => {
                if (errorStar) {
                    console.error("Error evolveMinepet (nether star inventory):", errorStar);
                    res.status(500).json(errorStar);
                    return;
                }
                if (rowsStar.length === 0) {
                    res.status(404).json({ message: "Nether Star inventory entry not found" });
                    return;
                }

                const starInv = rowsStar[0];
                if (!isAdmin && starInv.user_id !== user_id) {
                    res.status(403).json({ message: "Nether Star inventory entry does not belong to user" });
                    return;
                }
                if (starInv.item_id == null) {
                    res.status(400).json({ message: "Selected item entry is not an item" });
                    return;
                }

                const cbItem = (errorItem, rowsItem) => {
                    if (errorItem) {
                        console.error("Error evolveMinepet (item lookup):", errorItem);
                        res.status(500).json(errorItem);
                        return;
                    }
                    if (rowsItem.length === 0) {
                        res.status(404).json({ message: "Item not found" });
                        return;
                    }

                    const item = rowsItem[0];
                    if (item.name !== 'Nether Star') {
                        res.status(400).json({ message: "Selected item is not a Nether Star" });
                        return;
                    }

                    const updateSql = `
                        UPDATE Inventory
                        SET minepet_id = NULL,
                            evolved_minepet_id = ?,
                            bonus_hp = 0,
                            bonus_atk = 0,
                            bonus_def = 0,
                            applied_item_id = NULL
                        WHERE inventory_id = ?;
                    `;
                    const updateValues = [evolved_id, minepet_inventory_id];

                    inventoryModel.deleteById({ inventoryid: nether_star_inventory_id }, (errorDel) => {
                        if (errorDel) {
                            console.error("Error evolveMinepet (delete nether star):", errorDel);
                            res.status(500).json(errorDel);
                            return;
                        }

                        const pool = require('../services/db');
                        pool.query(updateSql, updateValues, (errorUpd) => {
                            if (errorUpd) {
                                console.error("Error evolveMinepet (update inventory):", errorUpd);
                                res.status(500).json(errorUpd);
                                return;
                            }

                            res.status(200).json({
                                message: "Minepet evolved successfully",
                                inventory_id: minepet_inventory_id,
                                evolved_id: evolved_id,
                                evolved_name: evo.name
                            });
                        });
                    });
                };

                itemModel.selectById({ id: starInv.item_id }, cbItem);
            };

            inventoryModel.selectById({ inventory_id: nether_star_inventory_id }, cbStarInv);
        };

        evolvedModel.selectById({ id: evolved_id }, cbEvolved);
    };

    inventoryModel.selectById({ inventory_id: minepet_inventory_id }, cbMinepetInv);
};
