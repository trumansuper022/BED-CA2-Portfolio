const minepetModel = require('../models/MinePetModel.js');

module.exports.readAllMinepet = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllMinepet:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    minepetModel.selectAll(callback);
};

module.exports.readMinepetById = (req, res, next) => {
    const data = { id: req.params.id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readMinepetById:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "Minepet not found" });
            } else {
                res.status(200).json(results[0]);
            }
        }
    };

    minepetModel.selectById(data, callback);
};

module.exports.createNewMinepet = (req, res, next) => {
    if (req.body.name == undefined ||
        req.body.description == undefined ||
        req.body.base_hp == undefined ||
        req.body.base_atk == undefined ||
        req.body.base_def == undefined) {
        res.status(400).json({ message: "Error: name, description, base_hp, base_atk or base_def is undefined" });
        return;
    }

    const data = {
        name: req.body.name,
        description: req.body.description,
        base_hp: req.body.base_hp,
        base_atk: req.body.base_atk,
        base_def: req.body.base_def
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewMinepet:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
            minepet_id: results.insertId,
            name: data.name,
            description: data.description,
            basehp: data.base_hp,
            baseatk: data.base_atk,
            basedef: data.base_def
        });
    };

    minepetModel.insertSingle(data, callback);
};

module.exports.updateMinepetById = (req, res, next) => {
    if (req.body.name == undefined ||
        req.body.description == undefined ||
        req.body.base_hp == undefined ||
        req.body.base_atk == undefined ||
        req.body.base_def == undefined) {
        res.status(400).json({ message: "Error: name, description, base_hp, base_atk or base_def is undefined" });
        return;
    }

    const data = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        base_hp: req.body.base_hp,
        base_atk: req.body.base_atk,
        base_def: req.body.base_def
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateMinepetById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Minepet not found" });
            } else {
                res.status(204).json({ message: "Minepet updated!" });
            }
        }
    };

    minepetModel.updateById(data, callback);
};

module.exports.deleteMinepetById = (req, res, next) => {
    const data = { id: req.params.id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteMinepetById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Minepet not found" });
            } else {
                res.status(204).json({ message: "Minepet deleted." });
            }
        }
    };

    minepetModel.deleteById(data, callback);
};
