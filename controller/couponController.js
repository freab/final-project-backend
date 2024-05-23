const couponRepository = require("../repository/couponRepository");
const responses = require("../utils/responses");

const couponController = {};

couponController.create = async (req, res) => {
    const { user_id, redeemed_date, is_redeemed, price, book_id } = req.body;

    if (!user_id || !redeemed_date || !is_redeemed || !price || !book_id) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const createCoupon = await couponRepository.create({
            user_id, redeemed_date, is_redeemed, price, book_id
        });

        return res.status(200).json(responses.getCustomResponse(createCoupon, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.editCoupon = async (req, res) => {
    const { id, user_id, redeemed_date, is_redeemed, price, book_id } = req.body;

    if (!id || !user_id || !redeemed_date || !is_redeemed || !price || !book_id) {
        return res.status(200).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const updateCoupon = await couponRepository.edit(id, {
            user_id, redeemed_date, is_redeemed, price, book_id
        });

        return res.status(200).json(responses.getCustomResponse(updateCoupon, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);
    const isRedeemed = req.query.isRedeemed;

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const coupons = await couponRepository.getAll(skip, take, isRedeemed);
        return res.status(200).json(responses.getCustomResponse(coupons, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.redeemCoupon = async (req, res) => {
    const { couponString, bookId, userId } = req.body;

    const requiredFields = [
        'couponString', 'bookId', 'userId'
    ]

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const redeemCoupon = await couponRepository.redeemCoupon(couponString, bookId, userId);
        return res.status(200).json(responses.getCustomResponse(redeemCoupon, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.isRedeemed = async (req, res) => {
    const couponString = req.query.couponString;

    const requiredFields = [
        'couponString'
    ]

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const isRedeemed = couponRepository.isRedeemed(couponString);
        const response = {
            "isRedeemed": isRedeemed,
            "couponString": couponString
        }

        return res.status(200).json(responses.getCustomResponse(response, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};


couponController.getById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const coupons = await couponRepository.getById(id);
        return res.status(200).json(responses.getCustomResponse(coupons, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.remove = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please Enter all fields..."
        }, true));
    }

    try {
        const removeCoupon = await couponRepository.remove(id);
        return res.status(200).json(responses.getCustomResponse(removeCoupon, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = couponController;