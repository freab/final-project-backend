const pagesRepository = require("../repository/pagesRepository");
const responses = require("../utils/responses");

const pageController = {};

pageController.create = async (req, res) => {
    const { bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription, modelId } = req.body;

    const requiredFields = [
        'bookId', 'bookInfoContentId', 'pagePreviewImageUrl', 'pageTitle', 'pageDescription', 'modelId'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createPage = await pagesRepository.createPage({
            bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription, modelId
        });

        return res.status(200).json(responses.getCustomResponse(createPage, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

pageController.editPage = async (req, res) => {
    const { id, bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription, modelId } = req.body;

    const requiredFields = [
        'id', 'bookId', 'bookInfoContentId', 'pagePreviewImageUrl', 'pageTitle', 'pageDescription', 'modelId'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createPage = await pagesRepository.edit(id, {
            bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription
        });

        return res.status(200).json(responses.getCustomResponse(createPage, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

pageController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllPages = await pagesRepository.getAll(skip, take);
        return res.status(200).json(responses.getCustomResponse(getAllPages, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

pageController.getById = async (req, res) => {
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundPage = await pagesRepository.getById(pageId);
        return res.status(200).json(responses.getCustomResponse(foundPage, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
}

pageController.getByBookId = async (req, res) => {
    const bookId = parseInt(req.param.bookId);

    if (isNaN(bookId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundPage = await pagesRepository.getByBookId(bookId);
        return res.status(200).json(responses.getCustomResponse(foundPage, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

pageController.delete = async (req, res) => {
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const removePage = await pagesRepository.delete(pageId);
        return res.status(200).json(responses.getCustomResponse(removePage, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = pageController;