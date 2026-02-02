const challengeModel = require('../models/challengeModel');
const userModel = require('../models/userModel');

module.exports.readAllChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllChallenges:", error);
            res.status(500).json(error);
            return;
        }
        res.status(200).json(results);
    };

    challengeModel.selectAll(callback);
};

module.exports.readChallengeById = (req, res, next) => {
    const challenge_id = req.params.id;

    if (challenge_id == undefined) {
        res.status(400).json({ message: "Error: challenge_id is undefined" });
        return;
    }

    const data = { challenge_id: parseInt(challenge_id) };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readChallengeById:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }

        res.status(200).json(results[0]);
    };

    challengeModel.selectById(data, callback);
};

module.exports.createChallenge = (req, res, next) => {
    const creator_id = req.body.creator_id;
    const description = req.body.description;
    const points = req.body.points;
    const MAX_POINTS = 100;

    if (creator_id == undefined || description == undefined || points == undefined) {
        res.status(400).json({ message: "Error: creator_id, description or points is undefined" });
        return;
    }
    if (points > MAX_POINTS) {
        res.status(400).json({ message: `Error: points must be <= ${MAX_POINTS}` });
        return;
    }

    const data = {
        creator_id: creator_id,
        description: description,
        points: points
    };

    const callback = (error, results, fields) => {
    if (error) {
        console.error("Error createChallenge:", error);
        res.status(500).json({ message: "Error creating challenge" });
        return;
    }

        res.status(201).json({
            challenge_id: results.insertId,
            creator_id: creator_id,
            description: description,
            points: points
        });
    };

    challengeModel.insertSingle(data, callback);
};

// Verify challenge ownership for update/delete (admin bypass)
module.exports.verifyChallengeOwnership = (req, res, next) => {
    const challenge_id = req.params.challenge_id || req.params.id;

    if (challenge_id == undefined) {
        res.status(400).json({ message: "Error: challenge_id is undefined" });
        return;
    }

    if (res.locals.userId === 1) {
        next();
        return;
    }

    const dataChallenge = { challenge_id: parseInt(challenge_id) };
    const cbChallenge = (errorC, resultsC) => {
        if (errorC) {
            console.error("Error verifyChallengeOwnership (challenge):", errorC);
            res.status(500).json(errorC);
            return;
        }

        if (resultsC.length === 0) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }

        const challenge = resultsC[0];
        const dataCrafter = { user_id: challenge.creator_id };
        const cbCrafter = (errorU, resultsU) => {
            if (errorU) {
                console.error("Error verifyChallengeOwnership (crafter):", errorU);
                res.status(500).json(errorU);
                return;
            }

            if (resultsU.length === 0) {
                res.status(404).json({ message: "Crafter not found" });
                return;
            }

            const crafter = resultsU[0];
            if (crafter.owner_user_id !== res.locals.userId) {
                res.status(403).json({ message: "Not allowed to modify this challenge" });
                return;
            }

            next();
        };

        userModel.selectById(dataCrafter, cbCrafter);
    };

    challengeModel.selectById(dataChallenge, cbChallenge);
};

module.exports.checkIsCreator = (req, res, next) => {
    const user_id = req.body.user_id;
    const challenge_id = req.body.challenge_id;

    if (user_id == undefined || challenge_id == undefined) {
        res.status(400).json({ message: "Error: user_id or challenge_id is undefined" });
        return;
    }

    const data = { challenge_id: challenge_id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkIsCreator:", error);
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }

        const challenge = results[0];

        if (challenge.creator_id !== user_id) {
            res.status(403).json({ message: "User is not the creator of this challenge" });
            return;
        }

        req.challenge = challenge;
        next();
    };

    challengeModel.selectById(data, callback);
};

module.exports.updateChallengeById = (req, res, next) => {
    const challenge_id = req.params.challenge_id;
    const description = req.body.description;
    const points = req.body.points;
    const MAX_POINTS = 100;

    if (challenge_id == undefined || description == undefined || points == undefined) {
        res.status(400).json({ message: "Error: challenge_id, description or points is undefined" });
        return;
    }
    if (points > MAX_POINTS) {
        res.status(400).json({ message: `Error: points must be <= ${MAX_POINTS}` });
        return;
    }

    const data = {
        challenge_id: challenge_id,
        description: description,
        points: points
    };

const callback = (error, results, fields) => {
    if (error) {
        console.error("Error updateChallengeById:", error);
        res.status(500).json({ message: "Error updating challenge" });
        return;
    }
    if (results.affectedRows == 0) {
        res.status(404).json({ message: "Challenge not found" });
        return;
    }
    res.status(200).json({ message: "Challenge updated", challenge_id: challenge_id, description: description, points: points });
};


    challengeModel.updateById(data, callback);
};

module.exports.deleteChallengeById = (req, res, next) => {
    const challenge_id = req.params.id;

    if (challenge_id == undefined) {
        res.status(400).json({ message: "Error: challenge_id is undefined" });
        return;
    }

    const data = { challenge_id: challenge_id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById:", error);
            res.status(500).json(error);
            return;
        }

                if (results.affectedRows === 0) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }


        res.status(200).json({
            message: "Challenge deleted",
            challenge_id: challenge_id
        });
    };

    challengeModel.deleteById(data, callback);
};


module.exports.deleteChallengeById1 = (req, res, next) => {
    const challenge_id = req.body.challenge_id;

    if (challenge_id == undefined) {
        res.status(400).json({ message: "Error: challenge_id is undefined" });
        return;
    }

    const data = { challenge_id: challenge_id };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById:", error);
            res.status(500).json(error);
            return;
        }

                if (results.affectedRows === 0) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }


        res.status(200).json({
            message: "Challenge deleted",
            challenge_id: challenge_id
        });
    };

    challengeModel.deleteById(data, callback);
};
