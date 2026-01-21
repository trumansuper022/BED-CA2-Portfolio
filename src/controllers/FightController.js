const fightModel = require('../models/FightModel');

const computeSum = (pet) => {
    return pet.base_hp + pet.base_atk + pet.base_def;
};

module.exports.simpleStatFight = (req, res, next) => {
    const attacker_id = req.body.attacker_id;
    const defender_id = req.body.defender_id;
    const attacker_minepet_id = req.body.attacker_minepet_id;
    const defender_minepet_id = req.body.defender_minepet_id;

    if (attacker_id == undefined || defender_id == undefined ||
        attacker_minepet_id == undefined || defender_minepet_id == undefined) {
        res.status(400).json({
            message: "Error: attacker_id, defender_id, attacker_minepet_id or defender_minepet_id is undefined"
        });
        return;
    }

    const dataPets = {
        attacker_minepet_id: attacker_minepet_id,
        defender_minepet_id: defender_minepet_id
    };

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

            if (pet.minepet_id === attacker_minepet_id) {
                attPet = pet;
            }

            if (pet.minepet_id === defender_minepet_id) {
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

    fightModel.selectTwoPetsById(dataPets, cbPets);
};
