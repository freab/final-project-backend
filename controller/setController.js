const setRepository = require("../repository/setRepository");
const responses = require("../utils/responses");

const setController = {};

setController.create = async (req, res) => {
    const { price, total_items, set_name } = req.body;

    if (!price || !total_items || !set_name) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields"
        }, true));
    }

    try {
        const createSet = await setRepository.create({
            price, total_items, set_name
        });

        return res.status(200).json(responses.getCustomResponse(createSet, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

setController.editSet = async (req, res) => {
    const { id, price, total_items, set_name } = req.body;

    if (!id || !price || !total_items || !set_name) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields..."
        }, true));
    }

    try {
        const updateSet = await setRepository.update(id, {
            price, total_items, set_name
        });

        return res.status(200).json(responses.getCustomResponse(updateSet, false));
    } catch (error) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please check server log..."
        }, true));
    }
};

setController.getAll = async (req, res) => {
    const { skip, take } = req.query;

    if (!skip || !take) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields..."
        }, true));
    }

    try {
        const getAllSets = await setRepository.getAll(skip, take);
        return res.status(200).json(responses.getCustomResponse(getAllSets, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

setController.getById = async (req, res) => {
    const { skip, take } = req.query;

    if (!skip || !take) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields..."
        }, true));
    }

    try {
        const getSetById = await setRepository.getById(skip, take);
        return res.status(200).json(responses.getCustomResponse(createSet, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = setController;