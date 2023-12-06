const { PrismaClient } = require("@prisma/client");
const { defaultProfileUrl } = require("../utils/constants");

const userRepository = {};
const prisma = new PrismaClient();

userRepository.create = async (user) => {
    return await prisma.user.create({
        data: {
            fname: user.fname || undefined,
            lname: user.lname || undefined,
            email: user.email || undefined,
            phone_number: user.phone_number || undefined,
            coupon_id: undefined,
            profle_ulr: defaultProfileUrl,
            created_at: new Date(),
            updated_at: new Date()
        }
    });
};

userRepository.getAll = async (skip, take, orderBy, text) => {
    return await prisma.user.findMany({
        where: {
            fname: {
                search: text || undefined,
            },
            lname: {
                search: text || undefined,
            },
            email: {
                search: text || undefined,
            },
            phone_number: {
                search: text || undefined,
            }
        },
        skip: skip || undefined,
        take: take || undefined,
        orderBy: {
            created_at: orderBy || undefined
        }
    });
}

userRepository.getUserByCuponId = async (couponId) => {
    return await prisma.user.findFirst({
        where: {
            coupon_id: couponId
        }
    });
};

userRepository.getUserById = async (userId) => {
    return await prisma.user.findFirst({
        where: {
            id: userId
        }
    });
};

userRepository.getUserByEmail = async (userEmail) => {
    return await prisma.user.findFirst({
        where: {
            email: userEmail
        }
    });
}

userRepository.edit = async (id, data) => {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
};

userRepository.remove = async (id) => {
    return prisma.user.delete({
        where: {
            id: id
        }
    });
}

module.exports = userRepository;