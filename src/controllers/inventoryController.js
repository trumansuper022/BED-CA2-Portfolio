const inventoryModel = require('../models/inventoryModel.js');

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

module.exports.createNewInventory = (req, res, next) => {
    if (!req.body.user_id) {
        res.status(400).send("Error: user_id is required");
        return;
    }

    const data = {
        user_id: Number(req.body.user_id),
        minepet_id: Number(req.body.minepet_id) || null,
        item_id: Number(req.body.item_id) || null
    };

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

module.exports.deleteInventoryById = (req, res, next) => {
    const data = {
        inventoryid: req.params.inventory_id
    };

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
  const data = {
    user_id: req.body.user_id,
    minepet_id: req.inventoryToAdd.minepetid || null,
    item_id: req.inventoryToAdd.itemid || null
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
