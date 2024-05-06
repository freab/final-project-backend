const jwt = require("jsonwebtoken");
const userRepository = require("../repository/userRepository");
const responses = require("../utils/responses");

const firebaseAuth = require("firebase/auth");


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

userController.updateDeviceToken = async (req, res) => {
    const { userId, deviceToken } = req.body;

    const requiredFields = [
        'userId', 'deviceToken'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const updateDeviceTokenForUser = await userRepository.updateDeviceToken(userId, deviceToken);
        return res.status(200).json(responses.getCustomResponse(updateDeviceTokenForUser, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userController.loginWithGoogle = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields."
        }));
    }

    try {
        const auth = firebaseAdmin.auth();
        console.log(firebaseAdmin);

        const ticket = await auth.verifyIdToken(idToken);
        const { email, name, picture, phone_number, auth_time } = ticket;

        auth.getUserByEmail(email)
            .then(async (user) => {
                let userInDb = await userRepository.getUserByEmail(email);

                if (!userInDb) {
                    userInDb = await userRepository.create({
                        fname: name.split(" ")[0],
                        lname: name.split(" ")[1],
                        phone_number: phone_number,
                        email: email,
                        profile_url: picture,
                        score: 0,
                        last_login: new Date(auth_time)
                    });
                }

                const token = jwt.sign(userInDb, process.env.JWT_SECRET, {
                    expiresIn: "30d",
                });

                res.status(200).json(responses.getCustomResponse({
                    user: userInDb,
                    token: token
                }));
            }).catch(async error => {
                await auth.createUser({
                    email,
                    displayName: name,
                    photoURL: picture
                });

                const newUser = await userRepository.create({
                    fname: name.split(" ")[0],
                    lname: name.split(" ")[1],
                    phone_number: phone_number,
                    email: email,
                    profile_url: picture,
                    last_login: new Date(auth_time)
                });

                const token = jwt.sign(newUser, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                });

                res.status(200).json(responses.getCustomResponse({
                    user: newUser,
                    token: token
                }, false));
            });
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userController.loginWithEmail = async (req, res) => {
    const { email, password } = req.body;

    const requiredFields = [
        'email', 'password'
    ];


    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const auth = firebaseAuth.getAuth();
        const admin = firebaseAdmin.auth();
        const userInDB = await userRepository.getUserByEmail(email);

        admin.getUserByEmail(email)
            .then(async user => {
                const token = jwt.sign(userInDB, process.env.JWT_SECRET, {
                    expiresIn: "30d",
                });

                res.status(200).json(responses.getCustomResponse({
                    user: userInDB,
                    token: token
                }, false));
            }).catch(async error => {
                firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
                    .then(async (user) => {
                        if (userInDB) {
                            const token = jwt.sign(userInDB, process.env.JWT_SECRET, {
                                expiresIn: "1d",
                            });

                            res.status(200).json(responses.getCustomResponse({
                                user: userInDB,
                                token: token
                            }, false));
                        } else {
                            const newUser = await userRepository.create({
                                fname: user.user.displayName ? user.user.displayName.split(" ")[0] : undefined,
                                lname: user.user.displayName ? user.user.displayName.split(" ")[1] : undefined,
                                phone_number: user.user.phoneNumber,
                                email: user.user.email,
                                profile_url: user.user.photoURL,
                                last_login: new Date(parseInt(user.user.metadata.lastLoginAt))
                            });

                            const token = jwt.sign({ newUser }, process.env.JWT_SECRET, {
                                expiresIn: "1d",
                            });

                            res.status(200).json(responses.getCustomResponse({
                                user: newUser,
                                token: token
                            }, false));
                        }
                    }).catch(error => {
                        console.log(error)
                        res.status(500).json(responses.getCustomResponse(error, true));
                    });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userController.referesh = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await userRepository.getById(id);
        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json(responses.getCustomResponse({
            user: user,
            token: token
        }, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

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

userController.incrementScore = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const updatedUser = await userRepository.incrementScore(userId);
        return res.status(200).json(responses.getCustomResponse(updatedUser), false);
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userController.incrementScoreByFactor = async (req, res) => {
    const { userId, factor } = req.body;

    if (isNaN(userId) || isNaN(factor)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }


    try {
        const updatedUser = await userRepository.incrementScoreByFactor(parseInt(userId), parseInt(factor));
        return res.status(200).json(responses.getCustomResponse(updatedUser), false);
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

userController.getScoreBoard = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const isAsc = req.query.isAsc;

    if (isNaN(skip) || isNaN(take) || (isAsc === null || isAsc === undefined || isAsc === '')) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const usersList = await userRepository.getScoreBoard(take, skip, isAsc);
        return res.status(200).json(responses.getCustomResponse(usersList, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

userController.deleteProfile = async (req, res) => {
    const { id, email } = req.user;

    try {
        const auth = firebaseAdmin.auth();
        const user = await auth.getUserByEmail(email);

        auth.deleteUser(user.uid);
        await userRepository.remove(id);
        res.status(200).json(responses.getCustomResponse({
            message: "Done"
        }, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = userController;