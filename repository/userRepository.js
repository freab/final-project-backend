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
            score: 0,
            created_at: new Date(),
            updated_at: new Date()
        }
    });
};

userRepository.getById = async (userId) => {
    return await prisma.user.findFirst({
        where: {
            id: userId
        }
    });
}

userRepository.incrementScore = async (userId) => {
    return await prisma.user.update({
        data: {
            score: {
                increment: 1
            }
        },

        where: {
            id: userId
        }
    });
};

userRepository.getScoreBoard = async (take, skip, isAsc) => {
    const orderByDirection = isAsc ? 'asc' : 'desc';
    return await prisma.user.findMany({
        orderBy: {
            score: orderByDirection
        },
        skip: skip,
        take: take
    });
};

userRepository.incrementScoreByFactor = async (userId, factor) => {
    return await prisma.user.update({
        data: {
            score: {
                increment: factor
            }
        },

        where: {
            id: userId
        }
    });
};

userRepository.updateDeviceToken = async (userId, deviceIdToken) => {
    return await prisma.user.update({
        data: {
            deviceToken: deviceIdToken
        },
        where: {
            id: userId
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