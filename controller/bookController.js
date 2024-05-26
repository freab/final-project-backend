const bookRepository = require("../repository/bookRepository");
const responses = require("../utils/responses");
const util = require('util');

const bookController = {};

bookController.create = async (req, res) => {
    const { name, author, type, cover_url, description, price } = req.body;

    const requiredFields = [
        'name', 'author', 'type', 'cover_url', 'description', 'price'
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
            cover_url,
            description,
            price
        });

        return res.status(200).json(responses.getCustomResponse(createBook, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

bookController.editBook = async (req, res) => {
    const { id, name, author, type, cover_url, description, price } = req.body;

    const requiredFields = [
        'id', 'name', 'author', 'type', 'cover_url', 'description', 'price'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const updateBook = await bookRepository.edit(id, {
            name, author, type, cover_url, description, price
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
            getAllBooks = await bookRepository.getAll(skip, take, text);
        } else {
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

bookController.activateBookByCoupon = async (req, res) => {
    const { bookId, userId, couponString } = req.body;

    const requiredFields = [
        'bookId', 'userId', 'couponString'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }


    try {
        const result = await bookRepository.activateBookByCoupon(bookId, userId, couponString);
        
        //Sending status of 200 because I want to display server errors on mobile. 
        //Dear God, forgive me for I have sinned. 
        if (result.success) {
            return res.status(200).json(responses.getCustomResponse("Successfully activated coupon!", false));
        } else {
            return res.status(200).json(responses.getCustomResponse({
                message: result.error
            }, true));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(responses.getCustomResponse({
            message: "An error occurred while activating the coupon."
        }, true));
    }
};

bookController.getChapaLink = async (req, res) => {
    const { userId, bookId } = req.body;

    const requiredFields = ['userId', 'bookId'];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const result = await bookRepository.getChapaLink(userId, bookId);

        if (result.success) {
            return res.status(200).json(responses.getCustomResponse({
                checkoutUrl: result.checkoutUrl
            }, false));
        } else {
            return res.status(400).json(responses.getCustomResponse({
                message: result.error
            }, true));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(responses.getCustomResponse({
            message: "An error occurred while processing the request."
        }, true));
    }
};

bookController.paymentCallback = async (req, res) => {
    const event = req.body;    
    //const eventbody = util.inspect(req, { depth: null });

    console.log("event-body", event);

    try {
        const result = await bookRepository.paymentCallback(event);

        if (result.success) {
            return res.status(200).json(responses.getCustomResponse({
                message: result.message
            }, false));
        } else {
            return res.status(400).json(responses.getCustomResponse({
                message: result.error
            }, true));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(responses.getCustomResponse({
            message: "An error occurred while processing the payment callback."
        }, true));
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