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

        if (inv.minepet_id === null) {
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
