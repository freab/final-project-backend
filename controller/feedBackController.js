const feedBackRepository = require("../repository/feedBackRepository");
const responses = require("../utils/responses");

const feedBackController = {};

feedBackController.create = async (req, res) => {
    const { type, content, email } = req.body;

    const requiredFields = [
        'type', 'content', 'email'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createFeedBack = await feedBackRepository.create({
            type, content, email
        });

        return res.status(200).json(responses.getCustomResponse(createFeedBack, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

feedBackController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllFeedBacks = await feedBackRepository.getAll(skip, take);
        return res.status(200).json(responses.getCustomResponse(getAllFeedBacks, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

feedBackController.getAllByType = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const type = req.query.type;

    if (isNaN(skip) || isNaN(take) || !type) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllFeedBacks = await feedBackRepository.getByType(skip, take, type);
        return res.status(200).json(responses.getCustomResponse(getAllFeedBacks, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

feedBackController.getAllByEmail = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const email = req.query.email;

    if (isNaN(skip) || isNaN(take) || !email) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllFeedBacks = await feedBackRepository.getByEmail(skip, take, email);
        return res.status(200).json(responses.getCustomResponse(getAllFeedBacks, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

feedBackController.delete = async (req, res) => {
    const feedBackId = parseInt(req.params.feedBackId);

    if (isNaN(feedBackId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const deleteFeedback = await feedBackRepository.remove(feedBackId);
        return res.status(200).json(responses.getCustomResponse(deleteFeedback, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

module.exports = feedBackController;