const bookRepository = require("../repository/bookRepository");
const responses = require("../utils/responses");

const bookController = {};

bookController.create = async (req, res) => {
    const { name, author, type, cover_url } = req.body;

    if (!name || !author || !type) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const createBook = await bookRepository.create({
            name,
            author,
            type,
            cover_url
        });

        return res.status(200).json(responses.getCustomResponse(createBook, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.editBook = async (req, res) => {
    const { id, name, author, type, cover_url } = req.body;

    if (!name || !author || !type || !cover_url) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const updateBook = await bookRepository.edit(id, {
            name, author, type, cover_url
        });

        return res.status(200).json(responses.getCustomResponse(updateBook, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.getAll = async (req, res) => {
    const { skip, take } = req.query;

    if (!skip || !take) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllBooks = await bookRepository.getAll(skip, take);
        return res.status(200).json(responses.getCustomResponse(getAllBooks, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.getById = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundBook = await bookRepository.getById(id);
        return res.status(200).json(responses.getCustomResponse(foundBook, true));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.getByType = async (req, res) => {
    const { type } = req.body;

    if (!type) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundBook = await bookRepository.getBookByType(type);
        return res.status(200).json(responses.getCustomResponse(foundBook, true));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.remove = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const remove = await bookRepository.remove(id);
        return res.status(200).json(responses.getCustomResponse(remove, true));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = bookController;