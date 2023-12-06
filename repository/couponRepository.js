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

couponRepository.getAll = async (skip, take, orderBy) => {
    return await prisma.coupon.findMany({
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