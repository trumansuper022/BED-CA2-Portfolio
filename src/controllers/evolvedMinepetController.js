const evolvedModel = require('../models/EvolvedMinepetModel.js');

module.exports.readAllEvolved = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error readAllEvolved:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    evolvedModel.selectAll(callback);
};

module.exports.readEvolvedById = (req, res, next) => {
    const data = { id: req.params.id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readEvolvedById:", error);
            res.status(500).json(error);
        } else if (results.length === 0) {
            res.status(404).json({ message: "Evolved minepet not found" });
        } else {
            res.status(200).json(results[0]);
        }
    };

    evolvedModel.selectById(data, callback);
};

module.exports.readEvolvedByBase = (req, res, next) => {
    const data = { base_minepet_id: Number(req.params.base_id) };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readEvolvedByBase:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    evolvedModel.selectByBaseId(data, callback);
};

module.exports.createEvolved = (req, res, next) => {
    if (req.body.base_minepet_id == undefined ||
        req.body.name == undefined ||
        req.body.description == undefined ||
        req.body.base_hp == undefined ||
        req.body.base_atk == undefined ||
        req.body.base_def == undefined) {
        res.status(400).json({ message: "Error: one or more required fields are undefined" });
        return;
    }

    const data = {
        base_minepet_id: req.body.base_minepet_id,
        name: req.body.name,
        description: req.body.description,
        base_hp: req.body.base_hp,
        base_atk: req.body.base_atk,
        base_def: req.body.base_def
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error createEvolved:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                evolved_id: results.insertId,
                name: data.name
            });
        }
    };

    evolvedModel.insertSingle(data, callback);
};

module.exports.updateEvolvedById = (req, res, next) => {
    if (req.body.base_minepet_id == undefined ||
        req.body.name == undefined ||
        req.body.description == undefined ||
        req.body.base_hp == undefined ||
        req.body.base_atk == undefined ||
        req.body.base_def == undefined) {
        res.status(400).json({ message: "Error: one or more required fields are undefined" });
        return;
    }

    const data = {
        id: req.params.id,
        base_minepet_id: req.body.base_minepet_id,
        name: req.body.name,
        description: req.body.description,
        base_hp: req.body.base_hp,
        base_atk: req.body.base_atk,
        base_def: req.body.base_def
    };

    const cbExisting = (errorExisting, rowsExisting) => {
        if (errorExisting) {
            console.error("Error updateEvolvedById (select):", errorExisting);
            res.status(500).json(errorExisting);
            return;
        }
        if (rowsExisting.length === 0) {
            res.status(404).json({ message: "Evolved minepet not found" });
            return;
        }
        const callback = (error, results) => {
            if (error) {
                console.error("Error updateEvolvedById:", error);
                res.status(500).json(error);
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: "Evolved minepet not found" });
            } else {
                res.status(204).json({ message: "Evolved minepet updated" });
            }
        };

        evolvedModel.updateById(data, callback);
    };

    evolvedModel.selectById({ id: data.id }, cbExisting);
};

module.exports.deleteEvolvedById = (req, res, next) => {
    const data = { id: req.params.id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteEvolvedById:", error);
            res.status(500).json(error);
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "Evolved minepet not found" });
        } else {
            res.status(204).json({ message: "Evolved minepet deleted" });
        }
    };

    evolvedModel.deleteById(data, callback);
};
