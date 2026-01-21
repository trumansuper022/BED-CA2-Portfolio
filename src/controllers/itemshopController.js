const itemshopModel = require('../models/itemshopModel.js');

module.exports.readAllItemshop = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllItemshop:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };
    itemshopModel.selectAll(callback);
};

module.exports.readItemshopById = (req, res, next) => {
    const data = { id: req.params.id };
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readItemshopById:", error);
            res.status(500).json(error);
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: "Item shop entry not found" });
            } else {
                res.status(200).json(results[0]);
            }
        }
    };
    itemshopModel.selectById(data, callback);
};

module.exports.createNewItemshop = (req, res, next) => {
    if (req.body.item_id == undefined) {
        res.status(400).send("Error: item_id is undefined");
        return;
    }
    if (req.body.price_points == undefined) {
        res.status(400).send("Error: price_points is undefined");
        return;
    }

    const data = {
        item_id: req.body.item_id,
        price_points: req.body.price_points
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewItemshop:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                itemshop_id: results.insertId,
                itemid: data.item_id,
                pricepoints: data.price_points
            })
        }
    };
    itemshopModel.insertSingle(data, callback);
};

module.exports.updateItemshopById = (req, res, next) => {
    if (req.body.item_id == undefined) {
        res.status(400).json({ message: "Error: item_id is undefined" });
        return;
    }
    if (req.body.price_points == undefined) {
        res.status(400).json({ message: "Error: price_points is undefined" });
        return;
    }

    const data = {
        id: req.params.id,
        item_id: req.body.item_id,
        price_points: req.body.price_points
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateItemshopById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Item shop entry not found" });
            } else {
                res.status(204).json({ message: "Item shop entry updated!" });
            }
        }
    };
    itemshopModel.updateById(data, callback);
};

module.exports.deleteItemshopById = (req, res, next) => {
    const data = { id: req.params.id };
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteItemshopById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Item shop entry not found" });
            } else {
                res.status(204).json({ message: "Item shop entry deleted." });
            }
        }
    };
    itemshopModel.deleteById(data, callback);
};

module.exports.loadItemshopForBuy = (req, res, next) => {
    if (req.body.itemshop_id == undefined) {
        res.status(400).json({ message: "Error: itemshop_id is undefined" });
        return;
    }

    const data = { id: req.body.itemshop_id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error loadItemshopForBuy:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "Item shop entry not found" });
            } else {
                const shop = results[0];
                req.priceToPay = shop.price_points;
                req.inventoryToAdd = {
                    minepet_id: null,
                    item_id: shop.item_id
                };
                req.inventoryMessage = "Item purchased successfully";
                next();
            }
        }
    };

    itemshopModel.selectById(data, callback);
};
