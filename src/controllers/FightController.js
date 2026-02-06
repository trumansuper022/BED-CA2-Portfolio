const fightModel = require('../models/FightModel');

const computeSum = (pet) => {
    return pet.base_hp + pet.base_atk + pet.base_def;
};

module.exports.simpleStatFight = (req, res, next) => {
    const attacker_id = req.body.attacker_id;
    const defender_id = req.body.defender_id;
    const attacker_inventory_id = req.body.attacker_minepet_id;
    let defender_inventory_id = req.body.defender_minepet_id;
    const isAdmin = (res.locals && res.locals.userId === 1);

    if (attacker_id == undefined || defender_id == undefined ||
        attacker_inventory_id == undefined) {
        res.status(400).json({
            message: "Error: attacker_id, defender_id, attacker_minepet_id or defender_minepet_id is undefined"
        });
        return;
    }

        if (attacker_id == defender_id || defender_id == attacker_id) {
        res.status(400).json({
            message: "Cannot fight yourself bozo."
        });
        return;
    }

    const cbPets = (errorP, rowsP, fieldsP) => {
        if (errorP) {
            console.error("Error simpleStatFight (selectTwoPetsById):", errorP);
            res.status(500).json(errorP);
            return;
        }

        if (rowsP.length !== 2) {
            res.status(400).json({ message: "Error: could not find both MinePets" });
            return;
        }

        let attPet = null;
        let defPet = null;

        for (let i = 0; i < rowsP.length; i++) {
            const pet = rowsP[i];

            if (pet.inventory_id === attacker_inventory_id) {
                attPet = pet;
            }

            if (pet.inventory_id === defender_inventory_id) {
                defPet = pet;
            }
        }

        if (attPet == null || defPet == null) {
            res.status(400).json({ message: "Error: missing MinePet row" });
            return;
        }

        const attSum = computeSum(attPet);
        const defSum = computeSum(defPet);
        const total = attSum + defSum;

        let attackerChance = 0.5;
        if (total > 0) {
            attackerChance = attSum / total;
        }

        const roll = Math.random();
        let winnerSide;

        if (roll < attackerChance) {
            winnerSide = 'A';
        } else {
            winnerSide = 'B';
        }

        let winner_id;

        if (winnerSide === 'A') {
            winner_id = attacker_id;
        } else {
            winner_id = defender_id;
        }

        let log = `Attacker uses ${attPet.name} (sum ${attSum}). `;
        log = log + `Defender uses ${defPet.name} (sum ${defSum}). `;
        log = log + `Attacker win chance = ${(attackerChance * 100).toFixed(1)}%. `;

        if (winnerSide === 'A') {
            log = log + `Winner: attacker.`;
        } else {
            log = log + `Winner: defender.`;
        }

        const dataFight = {
            attacker_id: attacker_id,
            defender_id: defender_id,
            winner_id: winner_id
        };

        const cbFight = (errorF, resultsF, fieldsF) => {
            if (errorF) {
                console.error("Error simpleStatFight (insertFight):", errorF);
                res.status(500).json(errorF);
                return;
            }

            const fight_id = resultsF.insertId;

            req.fight_id = fight_id;
            req.winner_id = winner_id;
            req.round_log = log;

            res.status(200).json({
                fight_id: fight_id,
                attacker_id: attacker_id,
                defender_id: defender_id,
                attacker_pet: attPet.name,
                defender_pet: defPet.name,
                attacker_sum: attSum,
                defender_sum: defSum,
                attacker_win_chance: attackerChance,
                winner_id: winner_id,
                log: log
            });

            next();
        };

        fightModel.insertFight(dataFight, cbFight);
    };

    const dataPets = {
        attacker_inventory_id: attacker_inventory_id,
        defender_inventory_id: defender_inventory_id
    };

    // If defender minepet not provided (non-admin flow), pick one from defender inventory
    if (!isAdmin) {
        defender_inventory_id = null;
    }

    if (defender_inventory_id == undefined || defender_inventory_id == null) {
        const inventoryModel = require('../models/inventoryModel.js');
        const dataInv = { user_id: defender_id };

        const cbInv = (errorInv, rowsInv) => {
            if (errorInv) {
                console.error("Error simpleStatFight (select defender inventory):", errorInv);
                res.status(500).json(errorInv);
                return;
            }

            const minepetInv = rowsInv.filter((inv) => inv.minepet_id != null || inv.evolved_minepet_id != null);
            if (minepetInv.length === 0) {
                res.status(400).json({ message: "Defender has no minepets" });
                return;
            }

            const index = Math.floor(Math.random() * minepetInv.length);
            defender_inventory_id = minepetInv[index].inventory_id;

            const dataPetsAuto = {
                attacker_inventory_id: attacker_inventory_id,
                defender_inventory_id: defender_inventory_id
            };

            fightModel.selectTwoPetsByInventoryId(dataPetsAuto, cbPets);
        };

        inventoryModel.selectAllByUserId(dataInv, cbInv);
        return;
    }

    fightModel.selectTwoPetsByInventoryId(dataPets, cbPets);
};

module.exports.readFightHistory = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error readFightHistory:", error);
            res.status(500).json(error);
            return;
        }
        res.status(200).json(results);
    };

    fightModel.selectFightHistory(callback);
};

module.exports.readWinCounters = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error readWinCounters:", error);
            res.status(500).json(error);
            return;
        }
        res.status(200).json(results);
    };

    fightModel.selectWinCounters(callback);
};
