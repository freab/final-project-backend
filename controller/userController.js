const jwt = require("jsonwebtoken");
const userRepository = require("../repository/userRepository");
const responses = require("../utils/responses");

const userController = {};

//bot test comment
userController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    console.log("skip: " + skip + " and take: " + take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields..."
        }, true));
    }

    try {
        const users = await userRepository.getAll(skip, take);
        res.status(200).json(responses.getCustomResponse(users, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userController.loginWithGoogle = async () => { };

userController.loginWithEmail = async () => { };

userController.referesh = async () => { };

userController.editProfile = async (req, res) => {
    const { id } = req.user.userInDB;

    try {
        const updatedUser = await userRepository.edit(id, req.body);

        res.status(200).json(
            responses.getCustomResponse(updatedUser), false);
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userController.deleteProfile = async (req, res) => {
    const { id, email } = req.user;

    try {

    } catch (error) {

    }
};

module.exports = userController;