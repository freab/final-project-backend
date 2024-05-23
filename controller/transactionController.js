const transactionRepository = require("../repository/transactionRepository");
const responses = require("../utils/responses");

const transactionController = {};

transactionController.create = async (req, res) => {
    const { userId, bookId, status, transactionRef } = req.body;

    if (!userId || !bookId || !status || !transactionRef) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const createTransaction = await transactionRepository.create({
            userId, bookId, status, transactionRef
        });

        return res.status(200).json(responses.getCustomResponse(createTransaction, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields..."
        }, true));
    }

    try {
        const getAllTransactions = await transactionRepository.getAll(skip, take);
        res.status(200).json(responses.getCustomResponse(getAllTransactions, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.getById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const transaction = await transactionRepository.getById(id);
        return res.status(200).json(responses.getCustomResponse(transaction, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.getByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(userId) || isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const transactions = await transactionRepository.getByUserId(userId, skip, take);
        return res.status(200).json(responses.getCustomResponse(transactions, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.getByBookId = async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(bookId) || isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const transactions = await transactionRepository.getByBookId(bookId, skip, take);
        return res.status(200).json(responses.getCustomResponse(transactions, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.updateStatus = async (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const updatedTransaction = await transactionRepository.updateStatus(id, status);
        return res.status(200).json(responses.getCustomResponse(updatedTransaction, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.getTransactionByStatus = async (req, res) => {
    const status = parseInt(req.params.status);
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(status) || isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getTransactionsByStatus = await transactionRepository.getByStatus(status, skip, take);
        return res.status(200).json(responses.getCustomResponse(getTransactionsByStatus, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

transactionController.remove = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const removedTransaction = await transactionRepository.remove(id);
        return res.status(200).json(responses.getCustomResponse(removedTransaction, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = transactionController;
