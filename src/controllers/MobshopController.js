const MobshopModel = require('../models/MobshopModel.js');

module.exports.readAllmobShop = (req, res, next) => {
  
    const callback = (error, results, fields) => {
      
        if (error) {
            console.error("Error readAllShop:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }
  
    MobshopModel.selectAll(callback);
};

module.exports.readmobShopById = (req, res, next) => {
   
    const data = { id: req.params.id };
  
  
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readShopById:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "Shop entry not found" });
            } else {
                res.status(200).json(results[0]);
            }
        }
    }
    MobshopModel.selectById(data, callback);
};

module.exports.createNewmobShop = (req, res, next) => {
    
    if (req.body.minepet_id == undefined) {
   
        res.status(400).send("Error: minepet_id or item_id must be defined");
        return;
    }
   
    if (req.body.price_points == undefined) {
  
        res.status(400).send("Error: price_points is undefined");
        return;
    }
  
    const data = {
        minepet_id: req.body.minepet_id || null,
        price_points: req.body.price_points
    };
  
    const callback = (error, results, fields) => {
     
        if (error) {
            console.error("Error createNewShop:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                mobshop_id: results.insertId,
                minepetid: data.minepet_id,
                pricepoints: data.price_points
            });
        }
    }
    MobshopModel.insertSingle(data, callback);
};

module.exports.updatemobShopById = (req, res, next) => {
   
    if (req.body.minepet_id == undefined) {
        res.status(400).json({ message: "Error: minepet_id or item_id must be defined" });
        return;
    }
    
    if (req.body.price_points == undefined) {
        res.status(400).json({ message: "Error: price_points is undefined" });
        return;
    }
    
    const data = {
        id: req.params.id,
        minepet_id: req.body.minepet_id || null,
        price_points: req.body.price_points
    };
    
    const callback = (error, results, fields) => {
     
        if (error) {
            console.error("Error updateShopById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Shop entry not found" });
            } else {
                res.status(204).json({ message: "Shop entry updated!" });
            }
        }
    }
    MobshopModel.updateById(data, callback);
};

module.exports.deletemobShopById = (req, res, next) => {
  
    const data = { id: req.params.id };
  
    const callback = (error, results, fields) => {
      
        if (error) {
            console.error("Error deleteShopById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Shop entry not found" });
            } else {
                res.status(204).json({ message: "Shop entry deleted." });
            }
        }
    }
    MobshopModel.deleteById(data, callback);
};

module.exports.loadMobshopForBuy = (req, res, next) => {
    if (req.body.mobshop_id == undefined) {
        res.status(400).json({ message: "Error: mobshop_id is undefined" });
        return;
    }

    const data = { id: req.body.mobshop_id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error loadMobshopForBuy:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "Mob shop entry not found" });
            } else {
                const shop = results[0];
                req.priceToPay = shop.price_points;
                req.inventoryToAdd = {
                    minepet_id: shop.minepet_id,
                    item_id: null
                };
                req.inventoryMessage = "Mob purchased successfully";
                next();
            }
        }
    };

    MobshopModel.selectById(data, callback);
};
