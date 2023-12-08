const modelRepository = require("../repository/modelRepositry");
const responses = require("../utils/responses");

const modelController = {};

modelController.create = async (req, res) => {
    const { book_id, mode_source_url, size, mode_name, page_number } = req.body;

    if (!book_id || !mode_source_url || !size || !mode_name || !page_number) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please check server log..."
        }, true));
    }

    try {
        const createModel = await modelRepository.create({
            book_id, mode_source_url, size, mode_name, page_number
        });

        return res.status(200).json(responses.getCustomResponse(createModel, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

modelController.editModel = async (req, res) => {
    const { id, book_id, mode_source_url, size, mode_name, page_number } = req.body;

    if (!id || !book_id || !mode_source_url || !size || !mode_name || !page_number) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please check server log..."
        }, true));
    }

    try {
        const updateModel = await modelRepository.edit(id, {
            book_id, mode_source_url, size, mode_name, page_number
        });

        return res.status(200).json(responses.getCustomResponse(updateModel, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

modelController.getById = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please check server log..."
        }, true));
    }

    try {

    } catch (error) {

    }
};