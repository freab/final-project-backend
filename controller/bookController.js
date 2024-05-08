const bookRepository = require("../repository/bookRepository");
const responses = require("../utils/responses");

const bookController = {};

bookController.create = async (req, res) => {
    const { name, author, type, cover_url } = req.body;

    const requiredFields = [
        'name', 'author', 'type', 'cover_url'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
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

    const requiredFields = [
        'id', 'name', 'author', 'type', 'cover_url'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
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
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const text = req.query.text;

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        let getAllBooks;
        if (text && text.trim() !== '') {
            console.log("going with search");
            getAllBooks = await bookRepository.getAll(skip, take, text);
        } else {
            console.log("going with out search");
            getAllBooks = await bookRepository.getAll(skip, take);
        }
        return res.status(200).json(responses.getCustomResponse(getAllBooks, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.getById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundBook = await bookRepository.getById(id);
        return res.status(200).json(responses.getCustomResponse(foundBook, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

//not actually featured. but more like random books lol
bookController.getFeatured = async (req, res) => {
    const take = parseInt(req.query.take);

    if (isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const randomBooks = await bookRepository.getRandomRaw(take);
        return res.status(200).json(responses.getCustomResponse(randomBooks, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

bookController.getByType = async (req, res) => {
    const { type } = req.query;

    if (!type) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundBook = await bookRepository.getBookByType(type);
        return res.status(200).json(responses.getCustomResponse(foundBook, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.remove = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const remove = await bookRepository.remove(id);
        return res.status(200).json(responses.getCustomResponse(remove, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = bookController;