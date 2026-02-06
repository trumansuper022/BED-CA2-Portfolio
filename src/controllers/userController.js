const userModel = require('../models/userModel');

module.exports.readAllUsers = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUsers:", error);
            res.status(500).json(error);
            return;
        }
        res.status(200).json(results);
    };

    userModel.selectAll(callback);
};

// Read players owned by the logged-in user
module.exports.readMyPlayers = (req, res, next) => {
    if (res.locals.userId === 1) {
        const callbackAll = (error, results) => {
            if (error) {
                console.error("Error readMyPlayers (admin):", error);
                res.status(500).json(error);
                return;
            }
            res.status(200).json(results);
        };
        userModel.selectAll(callbackAll);
        return;
    }

    const data = { owner_user_id: res.locals.userId };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readMyPlayers:", error);
            res.status(500).json(error);
            return;
        }
        res.status(200).json(results);
    };

    userModel.selectAllByOwner(data, callback);
};

// Verify crafter belongs to logged-in user (admin bypass)
module.exports.verifyCrafterOwnership = (req, res, next) => {
    const creator_id = req.body.creator_id;
    if (creator_id == undefined) {
        res.status(400).json({ message: "Error: creator_id is undefined" });
        return;
    }

    if (res.locals.userId === 1) {
        next();
        return;
    }

    const data = { user_id: Number(creator_id) };
    const callback = (error, results) => {
        if (error) {
            console.error("Error verifyCrafterOwnership:", error);
            res.status(500).json(error);
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: "Crafter not found" });
            return;
        }
        const crafter = results[0];
        if (crafter.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Crafter does not belong to user" });
            return;
        }
        next();
    };

    userModel.selectById(data, callback);
};
// Attach the first player id for the logged-in user
module.exports.attachDefaultPlayerId = (req, res, next) => {
    const data = { owner_user_id: res.locals.userId };

    const callback = (error, results) => {
        if (error) {
            console.error("Error attachDefaultPlayerId:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: "No players found for user" });
            return;
        }

        const player = results[0];
        req.body.creator_id = player.user_id;
        next();
    };

    userModel.selectFirstByOwner(data, callback);
};

module.exports.readUserById = (req, res, next) => {
    const user_id = req.params.id;

    if (user_id == undefined) {
        res.status(400).json({ message: "Error: user_id is undefined" });
        return;
    }

    const data = { user_id: parseInt(user_id) };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(results[0]);
    };

    userModel.selectById(data, callback);
};

module.exports.createUser = (req, res, next) => {
    const username = req.body.username;
    const points = 0;

    if (username == undefined) {
        res.status(400).json({ message: "Error: username is undefined" });
        return;
    }

    const data = {
        username: username,
        points: points,
        owner_user_id: res.locals.userId
    };

const callback = (error, results, fields) => {
    if (error) {
        console.error("Error createUser:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: "Username already exists" });
            return;
        }
        res.status(500).json({ message: "Error creating user" });
        return;
    }

    res.status(201).json({
        user_id: results.insertId,
        username: username,
        points: points
    });
};


    userModel.insertSingle(data, callback);
};

module.exports.updateUserById = (req, res, next) => {
    const userid = req.params.id;
    const username = req.body.username;
    const points = req.body.points;
    if (userid === undefined || username === undefined || points === undefined) {
        res.status(400).json({ message: "Error userid, username or points is undefined" });
        return;
    }
    const data = { userid: parseInt(userid), username: username, points: points };

    const callbackCheck = (errorCheck, resultsCheck) => {
        if (errorCheck) {
            console.error("Error updateUserById (check):", errorCheck);
            res.status(500).json(errorCheck);
            return;
        }

        if (resultsCheck.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const player = resultsCheck[0];
        if (res.locals.userId !== 1 && player.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Not allowed to update this player" });
            return;
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error updateUserById:", error);
                res.status(500).json(error);
                return;
            }
            res.status(200).json({ message: "User updated", userid: parseInt(userid), username: username, points: points });
        };

        userModel.updateById(data, callback);
    };

    userModel.selectById({ user_id: parseInt(userid) }, callbackCheck);
};


module.exports.deleteUserById = (req, res, next) => {
    const user_id = req.params.id;

    if (user_id == undefined) {
        res.status(400).json({ message: "Error: user_id is undefined" });
        return;
    }

    const data = { user_id: parseInt(user_id) };

    const callbackCheck = (errorCheck, resultsCheck) => {
        if (errorCheck) {
            console.error("Error deleteUserById (check):", errorCheck);
            res.status(500).json(errorCheck);
            return;
        }

        if (resultsCheck.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const player = resultsCheck[0];
        if (res.locals.userId !== 1 && player.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Not allowed to delete this player" });
            return;
        }

        const callbackDelete = (error, results, fields) => {
            if (error) {
                console.error("Error deleteUserById:", error);
                res.status(500).json(error);
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({
                message: "User deleted"
            });
        };

        userModel.deleteById(data, callbackDelete);
    };

    userModel.selectById(data, callbackCheck);
};

module.exports.addWinPoints = (req, res, next) => {
    const winner_id = req.winner_id;

    if (winner_id == null) {
        next();
        return;
    }

    const data = {
        user_id: winner_id,
        pointsToAdd: 20
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error addWinPoints:", error);
            res.status(500).json(error);
            return;
        }
        next();
    };

    userModel.incrementUserPoints(data, callback);
};

module.exports.updateUserPointsById = (req, res, next) => {
    if (req.body.user_id === undefined || req.body.pointsToAdd === undefined) {
        res.status(400).json({
            message: "Error: user_id or pointsToAdd is undefined"
        });
        return;
    }

    const data = {
        user_id: req.body.user_id,
        pointsToAdd: req.body.pointsToAdd
    };

    const callbackCheck = (errorCheck, resultsCheck) => {
        if (errorCheck) {
            console.error("Error updateUserPointsById (check):", errorCheck);
            res.status(500).json(errorCheck);
            return;
        }

        if (resultsCheck.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const player = resultsCheck[0];
        if (res.locals.userId !== 1 && player.owner_user_id !== res.locals.userId) {
            res.status(403).json({ message: "Not allowed to modify this player" });
            return;
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error updateUserPointsById:", error);
                res.status(500).json(error);
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ message: "User not found" });
                } else {
                    next();
                }
            }
        };

        userModel.incrementUserPoints(data, callback);
    };

    userModel.selectById({ user_id: req.body.user_id }, callbackCheck);
};


module.exports.checkAndDeductPoints = (req, res, next) => {
    if (req.body.user_id == undefined || req.priceToPay == undefined) {
        return res.status(400).json({ message: "Error: user_id or priceToPay is undefined" });
    }

    const user_id = Number(req.body.user_id);
    const price = req.priceToPay;

    const dataUser = { user_id: user_id };

    const callbackUser = (error, results, fields) => {
        if (error) {
            console.error("Error checkAndDeductPoints (select user):", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const user = results[0];
            if (res.locals.userId !== 1 && user.owner_user_id !== res.locals.userId) {
                res.status(403).json({ message: "Not allowed to use this player" });
                return;
            }
            if (user.points < price) {
                res.status(400).json({ message: "Not enough points" });
                return;
            }

            const dataDeduct = {
                user_id: user_id,
                pointsToDeduct: price
            };

            const callbackDeduct = (error2, results2, fields2) => {
                if (error2) {
                    console.error("Error checkAndDeductPoints (update):", error2);
                    res.status(500).json(error2);
                } else {
                    if (results2.affectedRows == 0) {
                        res.status(400).json({ message: "Could not deduct points" });
                    } else {
                        next();
                    }
                }
            };

            userModel.deductUserPoints(dataDeduct, callbackDeduct);
        }
    };

    userModel.selectById(dataUser, callbackUser);
};
