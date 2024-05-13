const { PrismaClient } = require("@prisma/client");
const userBooksRepository = require("../repository/userBooksRepository");
const userBooksController = {};
const prisma = new PrismaClient();

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

userBooksController.getByUserId = async(req, res) => {
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

userBooksController.getOwnedBooksByBookId = async(req, res) => {
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



module.exports = userBooksController;