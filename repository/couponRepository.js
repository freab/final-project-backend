const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const couponRepository = {};

couponRepository.create = async (coupon) => {
    return await prisma.coupon.create({
        data: {
            user_id: coupon.user_id || undefined,
            redeemed_date: undefined,
            is_redeemed: false,
            price: coupon.price || Number(0),
            book_id: coupon.book_id || undefined
        }
    });
};

couponRepository.getAll = async (skip, take, isRedeemed) => {
    return await prisma.coupon.findMany({
        where: {
            is_redeemed: isRedeemed || undefined
        },
        skip: skip,
        take: take
    });
};

couponRepository.getById = async (couponId) => {
    return await prisma.coupon.findFirst({
        where: {
            id: couponId
        }
    });
};

couponRepository.redeemCoupon = async (couponString, bookId, userId) => {
    return await prisma.coupon.update({
        where: {
            book_id: bookId,
            user_id: userId,
            coupon: couponString
        },
        data: {
            is_redeemed: true,
            user_id: userId,
            book_id: bookId
        }
    })
};

couponRepository.isRedeemed = async (couponString) => {
    const coupon = await prisma.coupon.findFirst({
        where: {
            coupon: couponString
        },
        select: {
            isRedeemed: true
        }
    });

    return coupon ? coupon.is_redeemed : false;
}


couponRepository.getByBookId = async (bookId, skip, take) => {
    return await prisma.coupon.findMany({
        where: {
            book_id: bookId
        },
        skip, take
    });
};

couponRepository.edit = async (id, data) => {
    return await prisma.coupon.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
};

couponRepository.remove = async (id) => {
    return await prisma.coupon.delete({
        where: {
            id: id
        }
    });
};

module.exports = couponRepository;