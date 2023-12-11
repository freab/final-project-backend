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

        return res.status(400).json(responses.getCustomResponse(createCoupon, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.editCoupon = async (req, res) => {
    const { id, user_id, redeemed_date, is_redeemed, price, book_id } = req.body;

    if (!id || !user_id || !redeemed_date || !is_redeemed || !price || !book_id) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const updateCoupon = await couponRepository.edit(id, {
            user_id, redeemed_date, is_redeemed, price, book_id
        });

        return res.status(400).json(responses.getCustomResponse(updateCoupon, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

couponController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const coupons = await couponRepository.getAll();
        return res.status(400).json(responses.getCustomResponse(coupons, false));
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
        return res.status(400).json(responses.getCustomResponse(coupons, false));
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