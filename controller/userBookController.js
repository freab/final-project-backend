const bookRepository = require("../repository/bookRepository");
const userBooksRepository = require("../repository/userBooksRepository");
const responses = require("../utils/responses");

const userBooksController = {};

userBooksController.create = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllUserBooks = await userBooksRepository.getAllOwnedBooks(skip, take);
        return res.status(200).json(responses.getCustomResponse(getAllUserBooks, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userBooksController.getByUserId = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const userId = parseInt(req.query.userId);

    if (isNaN(skip) || isNaN(take) || isNaN(userId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getUsersById = await userBooksRepository.getBooksByUserId(userId, skip, take);
        return res.status(200).json(responses.getCustomResponse(getUsersById, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userBooksController.getOwnedBooksByBookId = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const bookId = parseInt(req.query.bookId);

    if (isNaN(skip) || isNaN(take) || isNaN(bookId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getUsersById = await userBooksRepository.getBooksByBookId(bookId, skip, take);
        return res.status(200).json(responses.getCustomResponse(getUsersById, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userBooksController.updateBookProgressByAmount = async (req, res) => {
    const { userId, bookId, amount } = req.body;

    const requiredFields = ['userId', 'bookId', 'amount'];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const updateBookProgressByAmount = bookRepository.updateBookProgressByAmount(bookId, userId, amount);
        return res.status(200).json(responses.getCustomResponse(updateBookProgressByAmount, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userBooksController.updateBookProgressByIncrement = async (req, res) => {
    const { userId, bookId } = req.body;

    const requiredFields = ['userId', 'bookId'];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const updateBookProgressByIncrement = bookRepository.updateBookProgressByIncrement(bookId, userId);
        return res.status(200).json(responses.getCustomResponse(updateBookProgressByIncrement, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

userBooksController.ownsThisBook = async (req, res) => {
    const bookId = parseInt(req.query.bookId);
    const userId = parseInt(req.query.userId);

    if (isNaN(userId) || isNaN(bookId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        setTimeout(async () => {
            const ownsThisBook = await userBooksRepository.ownsThisBook(bookId, userId);
            return res.status(200).json(responses.getCustomResponse(ownsThisBook, false));
        }, 5000); 
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = userBooksController;