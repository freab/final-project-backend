const jwt = require("jsonwebtoken");
const userRepository = require("../repository/userRepository");
const responses = require("../utils/responses");

const userController = {};

userController.loginWithGoogle = async () => { };

userController.loginWithEmail = async () => { };

userController.referesh = async () => { };

userController.editProfile = async (req, res) => {
    const { id } = req.user.userInDB;

    try {
        const updatedUser = await userRepository.edit(id, req.body);

        res.status(200).json(responses.getCustomResponse(
            responses.getUserResponse(updatedUser), false));
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