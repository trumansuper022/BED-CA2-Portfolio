const userCompletionModel = require("../models/userCompletionModel.js");
const challengeModel = require("../models/challengeModel.js");

module.exports.checkNotCreator = (req, res, next) => {
    if (req.body.challenge_id == undefined || req.body.user_id == undefined) {
        res.status(400).json({
            message: "Error: challenge_id or user_id is undefined"
        });
        return;
    }

    const data = {
        challenge_id: Number(req.body.challenge_id),
        user_id: Number(req.body.user_id)
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkNotCreator:", error);
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(404).json({
                    message: "Challenge not found"
                });
            }
            else if (results[0].creator_id == data.user_id) {
                res.status(400).json({
                    message: "Creator cannot complete their own challenge"
                });
            }
            else next();
        }
    };

    const challengeData = {
        challenge_id: data.challenge_id
    };

    challengeModel.selectById(challengeData, callback);
};

module.exports.addCompletion = (req, res, next) => {
    if (req.body.challenge_id == undefined || req.body.user_id == undefined) {
        res.status(400).json({
            message: "Error: challenge_id or user_id is undefined"
        });
        return;
    }

    const data = {
        challenge_id: Number(req.body.challenge_id),
        user_id: Number(req.body.user_id)
    };

    const challengeData = {
        challenge_id: data.challenge_id
    };

    const getChallengeCallback = (error, results, fields) => {
        if (error) {
            console.error("Error addCompletion (get challenge):", error);
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(404).json({
                    message: "Challenge not found"
                });
            }
            else {
                const insertData = {
                    challenge_id: data.challenge_id,
                    user_id: data.user_id,
                    details: results[0].description
                };

                const insertCallback = (error, insertResults, fields) => {
                    if (error) {
                        console.error("Error addCompletion (insert):", error);
                        res.status(500).json(error);
                    }
                    else {
                        req.body.completionId = insertResults.insertId;
                        next();
                    }
                };

                userCompletionModel.insertSingle(insertData, insertCallback);
            }
        }
    };

    challengeModel.selectById(challengeData, getChallengeCallback);
};

module.exports.addPointsToUser = (req, res, next) => {
    if (req.body.challenge_id == undefined || req.body.user_id == undefined) {
        res.status(400).json({
            message: "Error: challenge_id or user_id is undefined"
        });
        return;
    }

    const data = {
        challenge_id: Number(req.body.challenge_id),
        user_id: Number(req.body.user_id)
    };

    const challengeQueryData = {
        challenge_id: data.challenge_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error addPointsToUser:", error);
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(404).json({
                    message: "Challenge not found"
                });
            }
            else {
                const challengePoints = results[0].points;
                req.body.pointsToAdd = challengePoints;
                req.challengeCompleted = true;
                next();
            }
        }
    };

    challengeModel.selectById(challengeQueryData, callback);
};


module.exports.readAllCompletions = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllCompletions:", error);
            res.status(500).json(error);
        }
        else {
            res.status(200).json(results);
        }
    };

    userCompletionModel.selectAll(callback);
};

module.exports.readCompletionById = (req, res, next) => {
    const data = {
        completion_id: req.params.completion_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readCompletionById:", error);
            res.status(500).json(error);
        }
        else {
            if (results.length == 0) {
                res.status(404).json({ message: "Completion not found" });
            } else {
                res.status(200).json(results[0]);
            }
        }
    };

    userCompletionModel.selectById(data, callback);
};

module.exports.deleteCompletionById = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteCompletionById:", error);
            res.status(500).json(error);
        }
        else {
            if (results.affectedRows == 0) {
                res.status(404).json({ message: "Completion not found" });
            } else {
                res.status(204).send();
            }
        }
    };

    userCompletionModel.deleteById(data, callback);
};