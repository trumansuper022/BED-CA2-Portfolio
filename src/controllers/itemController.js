const itemModel = require('../models/itemModel.js');

module.exports.readAllItem = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllItem:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    itemModel.selectAll(callback);
};

module.exports.readItemById = (req, res, next) => {
    const data = { id: req.params.id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readItemById:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "Item not found" });
            } else {
                res.status(200).json(results[0]);
            }
        }
    };

    itemModel.selectById(data, callback);
};

module.exports.createNewItem = (req, res, next) => {
    if (req.body.name == undefined ||
        req.body.description == undefined ||
        req.body.type == undefined ||
        req.body.bonus_hp == undefined ||
        req.body.bonus_atk == undefined ||
        req.body.bonus_def == undefined) {
        res.status(400).json({ message: "Error: one or more required fields are undefined" });
        return;
    }

    const data = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        bonus_hp: req.body.bonus_hp,
        bonus_atk: req.body.bonus_atk,
        bonus_def: req.body.bonus_def
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewItem:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);
        }
    };

    itemModel.insertSingle(data, callback);
};

module.exports.updateItemById = (req, res, next) => {
    if (req.body.name == undefined ||
        req.body.description == undefined ||
        req.body.type == undefined ||
        req.body.bonus_hp == undefined ||
        req.body.bonus_atk == undefined ||
        req.body.bonus_def == undefined) {
        res.status(400).json({ message: "Error: one or more required fields are undefined sigma" });
        return;
    }

    const data = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        bonus_hp: req.body.bonus_hp,
        bonus_atk: req.body.bonus_atk,
        bonus_def: req.body.bonus_def
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateItemById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Item not found" });
            } else {
                res.status(204).json({ message: "Item updated!" });
            }
        }
    };

    itemModel.updateById(data, callback);
};

module.exports.deleteItemById = (req, res, next) => {
    const data = { id: req.params.id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteItemById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Item not found" });
            } else {
                res.status(204).json({ message: "Item deleted." });
            }
        }
    };

    itemModel.deleteById(data, callback);
};
