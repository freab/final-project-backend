const jwt = require("jsonwebtoken");
const responses = require("../utils/responses");

const authMiddleware = {};

authMiddleware.userAuth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(400).json(responses.gerCustomResponse({
            message: 'Unauthorized!!'
        }, true));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json(response.gerCustomResponse({
                    message: 'Session expired'
                }, true));
            }

            req.user = decoded.newUser ? decoded.newUser : decoded;
            next();
        });
    } catch (error) {
        return res.status(400).json(responses.gerCustomResponse(error, true));
    }
};

authMiddleware.adminAuth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json(responses, getCustomResponse({
            message: 'Unauthorized!!'
        }, true));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json(responses.getCustomResponse({
                    message: 'Session expired!!'
                }, true));
            }

            if (decoded.username) {
                req.admin = decoded;
                next();
            } else {
                return res.status(400).json(responses.getCustomResponse({
                    message: 'Invalid token!!'
                }, true));
            }
        });
    } catch (error) {
        return res.status(400).json(responses.getCustomResponse(error, true));
    }
};

module.exports = authMiddleware;