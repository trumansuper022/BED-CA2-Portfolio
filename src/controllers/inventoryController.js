const inventoryModel = require('../models/inventoryModel.js');
const itemModel = require('../models/itemModel.js');

module.exports.readAllInventory = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllInventory:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    inventoryModel.selectAll(callback);
};

module.exports.readAllInventoryByUserId = (req, res, next) => {
    const data = {
        user_id: Number(req.params.user_id)
    };

    const userModel = require('../models/userModel.js');
    const isAdmin = res.locals.userId === 1;
    const cbPlayer = (errorPlayer, resultsPlayer) => {
        if (errorPlayer) {
            console.error("Error readAllInventoryByUserId (player):", errorPlayer);
            res.status(500).json(errorPlayer);
            return;
        }

        if (resultsPlayer.length === 0) {
            res.status(404).json({ message: "Player not found" });
            return;
        }

        const player = resultsPlayer[0];
        if (!isAdmin && player.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Not allowed to view this inventory" });
            return;
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllInventoryByUserId:", error);
                res.status(500).json(error);
            } else {
                res.status(200).json(results);
            }
        };

        inventoryModel.selectAllByUserId(data, callback);
    };

    userModel.selectById({ user_id: data.user_id }, cbPlayer);
};

module.exports.createNewInventory = (req, res, next) => {
    if (!req.body.user_id) {
        res.status(400).send("Error: user_id is required");
        return;
    }

    const data = {
        user_id: Number(req.body.user_id),
        minepet_id: Number(req.body.minepet_id) || null,
        evolved_minepet_id: Number(req.body.evolved_minepet_id) || null,
        item_id: Number(req.body.item_id) || null
    };

    const userModel = require('../models/userModel.js');
    const isAdmin = res.locals.userId === 1;
    const cbPlayer = (errorPlayer, resultsPlayer) => {
        if (errorPlayer) {
            console.error("Error createNewInventory (player):", errorPlayer);
            res.status(500).json(errorPlayer);
            return;
        }

        if (resultsPlayer.length === 0) {
            res.status(404).json({ message: "Player not found" });
            return;
        }

        const player = resultsPlayer[0];
        if (!isAdmin && player.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Not allowed to add inventory for this player" });
            return;
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createNewInventory:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json(results);
            }
        };

        inventoryModel.insertSingle(data, callback);
    };

    userModel.selectById({ user_id: data.user_id }, cbPlayer);
};

module.exports.deleteInventoryById = (req, res, next) => {
    const data = {
        inventoryid: req.params.inventory_id
    };

    const callbackCheck = (errorCheck, resultsCheck) => {
        if (errorCheck) {
            console.error("Error deleteInventoryById (check):", errorCheck);
            res.status(500).json(errorCheck);
            return;
        }

        if (resultsCheck.length === 0) {
            res.status(404).json({ message: "Inventory entry not found" });
            return;
        }

        const entry = resultsCheck[0];
        const userModel = require('../models/userModel.js');
        const isAdmin = res.locals.userId === 1;
        const cbPlayer = (errorPlayer, resultsPlayer) => {
            if (errorPlayer) {
                console.error("Error deleteInventoryById (player):", errorPlayer);
                res.status(500).json(errorPlayer);
                return;
            }

            if (resultsPlayer.length === 0) {
                res.status(404).json({ message: "Player not found" });
                return;
            }

            const player = resultsPlayer[0];
            if (!isAdmin && player.owner_user_id !== res.locals.userId) {
                res.status(403).json({ message: "Not allowed to delete this inventory" });
                return;
            }

            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error deleteInventoryById:", error);
                    res.status(500).json(error);
                } else if (results.affectedRows === 0) {
                    res.status(404).json({ message: "Inventory entry not found" });
                } else {
                    res.status(204).json({ message: "Inventory entry deleted" });
                }
            };

            inventoryModel.deleteById(data, callback);
        };

        userModel.selectById({ user_id: entry.user_id }, cbPlayer);
    };

    inventoryModel.selectById({ inventory_id: data.inventoryid }, callbackCheck);
};

module.exports.readInventoryById = (req, res, next) => {
    const data = {
        inventory_id: req.params.inventory_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readInventoryById:", error);
            res.status(500).json(error);
        } else if (results.length === 0) {
            res.status(404).json({ message: "Inventory entry not found" });
        } else {
            res.status(200).json(results[0]);
        }
    };

    inventoryModel.selectById(data, callback);
};

module.exports.addInventoryEntry = (req, res, next) => {
  if (!req.body.user_id) {
    res.status(400).json({ message: "Error: user_id is undefined" });
    return;
  }

  if (!req.inventoryToAdd) {
    res.status(500).json({ message: "Error: inventoryToAdd is not set" });
    return;
  }
  // Support both camel and snake case from upstream middleware
  const data = {
    user_id: req.body.user_id,
    minepet_id: req.inventoryToAdd.minepet_id || req.inventoryToAdd.minepetid || null,
    evolved_minepet_id: req.inventoryToAdd.evolved_minepet_id || null,
    item_id: req.inventoryToAdd.item_id || req.inventoryToAdd.itemid || null
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error addInventoryEntry:", error);
      res.status(500).json(error);
    } else {
      req.newInventoryId = results.insertId;
      next();
    }
  };

  inventoryModel.insertSingle(data, callback);
};


module.exports.respondInventorySuccess = (req, res, next) => {
    res.status(201).json({
        message: req.inventoryMessage || "Purchase successful",
        inventoryid: req.newInventoryId
    });
};

// Apply an item from inventory to a minepet inventory entry
module.exports.applyItemToMinepet = (req, res, next) => {
    const user_id = Number(req.body.user_id);
    const minepet_inventory_id = Number(req.body.minepet_inventory_id);
    const item_inventory_id = Number(req.body.item_inventory_id);

    if (!user_id || !minepet_inventory_id || !item_inventory_id) {
        res.status(400).json({ message: "Error: user_id, minepet_inventory_id or item_inventory_id is undefined" });
        return;
    }

    const userModel = require('../models/userModel.js');
    const dataPlayer = { user_id: user_id };
    const isAdmin = res.locals.userId === 1;

    const cbPlayer = (errorPlayer, resultsPlayer) => {
        if (errorPlayer) {
            console.error("Error applyItemToMinepet (player):", errorPlayer);
            res.status(500).json(errorPlayer);
            return;
        }

        if (resultsPlayer.length === 0) {
            res.status(404).json({ message: "Player not found" });
            return;
        }

        const player = resultsPlayer[0];
        if (!isAdmin && player.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Not allowed to modify this player" });
            return;
        }

        const dataMinepetInv = { inventory_id: minepet_inventory_id };
        const dataItemInv = { inventory_id: item_inventory_id };

        const cbMinepetInv = (error, rows) => {
            if (error) {
                console.error("Error applyItemToMinepet (minepet inventory):", error);
                res.status(500).json(error);
                return;
            }
            if (rows.length === 0) {
                res.status(404).json({ message: "Minepet inventory entry not found" });
                return;
            }

            const minepetInv = rows[0];
            if (minepetInv.user_id !== user_id || (minepetInv.minepet_id == null && minepetInv.evolved_minepet_id == null)) {
                res.status(403).json({ message: "Minepet inventory entry does not belong to user" });
                return;
            }

            const cbItemInv = (errorItem, rowsItem) => {
                if (errorItem) {
                    console.error("Error applyItemToMinepet (item inventory):", errorItem);
                    res.status(500).json(errorItem);
                    return;
                }
                if (rowsItem.length === 0) {
                    res.status(404).json({ message: "Item inventory entry not found" });
                    return;
                }

                const itemInv = rowsItem[0];
                if (itemInv.user_id !== user_id || itemInv.item_id == null) {
                    res.status(403).json({ message: "Item inventory entry does not belong to user" });
                    return;
                }

                const minePetModel = require('../models/minePetModel.js');
                const evolvedModel = require('../models/EvolvedMinepetModel.js');
                const itemData = { id: itemInv.item_id };

                const cbItem = (errorItemRow, itemRows) => {
                    if (errorItemRow) {
                        console.error("Error applyItemToMinepet (item lookup):", errorItemRow);
                        res.status(500).json(errorItemRow);
                        return;
                    }
                    if (itemRows.length === 0) {
                        res.status(404).json({ message: "Item not found" });
                        return;
                    }

                    const item = itemRows[0];
                    const itemName = String(item.name || '').toLowerCase().trim();

                    const cbPet = (errorPet, petRows) => {
                        if (errorPet) {
                            console.error("Error applyItemToMinepet (pet lookup):", errorPet);
                            res.status(500).json(errorPet);
                            return;
                        }
                        if (petRows.length === 0) {
                            res.status(404).json({ message: "Minepet not found" });
                            return;
                        }

                        const pet = petRows[0];
                        const petName = String(pet.name || '').toLowerCase().trim();
                        const baseHp = Number(pet.base_hp || 0);
                        const baseAtk = Number(pet.base_atk || 0);
                        const baseDef = Number(pet.base_def || 0);

                        const undeadPets = ['zombie', 'drowned', 'husk', 'baby zombie', 'skeleton', 'bogged', 'parched', 'stray'];
                        const trialPets = ['zombie', 'drowned', 'husk', 'baby zombie', 'skeleton', 'bogged', 'parched', 'stray', 'slime', 'magma cube'];

                        if (itemName === 'beehive' && petName !== 'bee') {
                            res.status(400).json({ message: "Beehive can only be applied to Bee minepets" });
                            return;
                        }
                        if (itemName === 'spawner' && !undeadPets.includes(petName)) {
                            res.status(400).json({ message: "Spawner can only be applied to undead minepets" });
                            return;
                        }
                        if (itemName === 'trial chamber' && !trialPets.includes(petName)) {
                            res.status(400).json({ message: "Trial Chamber can only be applied to Zombie, Skeleton, or Slime minepets" });
                            return;
                        }
                        if (itemName === 'wolf armor' && petName !== 'wolf') {
                            res.status(400).json({ message: "Wolf Armor can only be applied to Wolf minepets" });
                            return;
                        }

                        let bonusHpAdd = Number(item.bonus_hp || 0);
                        let bonusAtkAdd = Number(item.bonus_atk || 0);
                        let bonusDefAdd = Number(item.bonus_def || 0);

                        if (itemName === 'beehive') {
                            bonusHpAdd += baseHp;
                            bonusAtkAdd += 2;
                        } else if (itemName === 'spawner') {
                            bonusHpAdd += baseHp;
                        } else if (itemName === 'trial chamber') {
                            bonusHpAdd += Math.round(baseHp * 0.5);
                            bonusAtkAdd += Math.round(baseAtk * 0.5);
                            bonusDefAdd += Math.round(baseDef * 0.5);
                        } else if (itemName === 'wolf armor') {
                            bonusHpAdd += Math.round(baseHp * 0.5);
                            bonusDefAdd += baseDef;
                        }

                        const newBonusHp = (minepetInv.bonus_hp || 0) + bonusHpAdd;
                        const newBonusAtk = (minepetInv.bonus_atk || 0) + bonusAtkAdd;
                        const newBonusDef = (minepetInv.bonus_def || 0) + bonusDefAdd;

                        const updateData = {
                            inventoryid: minepetInv.inventory_id,
                            bonushp: newBonusHp,
                            bonusatk: newBonusAtk,
                            bonusdef: newBonusDef,
                            applied_item_id: item.item_id
                        };

                        const cbUpdate = (errorUpdate, updateResults) => {
                            if (errorUpdate) {
                                console.error("Error applyItemToMinepet (update minepet):", errorUpdate);
                                res.status(500).json(errorUpdate);
                                return;
                            }

                            const deleteData = { inventoryid: item_inventory_id };
                            const cbDelete = (errorDelete, deleteResults) => {
                                if (errorDelete) {
                                    console.error("Error applyItemToMinepet (delete item):", errorDelete);
                                    res.status(500).json(errorDelete);
                                    return;
                                }

                                res.status(200).json({
                                    message: "Item applied to minepet",
                                    minepet_inventory_id: minepetInv.inventory_id,
                                    applied_item_id: item.item_id,
                                    new_bonus_hp: newBonusHp,
                                    new_bonus_atk: newBonusAtk,
                                    new_bonus_def: newBonusDef
                                });
                            };

                            inventoryModel.deleteById(deleteData, cbDelete);
                        };

                        inventoryModel.updateBonusesAndAppliedItem(updateData, cbUpdate);
                    };

                    if (minepetInv.minepet_id != null) {
                        minePetModel.selectById({ id: minepetInv.minepet_id }, cbPet);
                    } else {
                        evolvedModel.selectById({ id: minepetInv.evolved_minepet_id }, cbPet);
                    }
                };

                itemModel.selectById(itemData, cbItem);
            };

            inventoryModel.selectById(dataItemInv, cbItemInv);
        };

        inventoryModel.selectById(dataMinepetInv, cbMinepetInv);
    };

    userModel.selectById(dataPlayer, cbPlayer);
};
