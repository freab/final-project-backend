const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const feedBackRepository = {};

feedBackRepository.create = async (feedBack) => {
    return await prisma.feedBack.create({
        data: {
            type: feedBack.type,
            content: feedBack.content,
            email: feedBack.email
        }
    });
};

feedBackRepository.getAll = async (skip, take) => {
    return await prisma.feedBack.findMany({
        skip, take
    });
};

feedBackRepository.getByType = async (skip, take, type) => {
    return await prisma.feedBack.findMany({
        where: {
            type: type
        },
        skip, take
    });
};

feedBackRepository.getByEmail = async (skip, take, email) => {
    return await prisma.feedBack.findMany({
        where: {
            email: email
        },
        skip, take
    });
};

feedBackRepository.remove = async (feedBackId) => {
    return await prisma.feedBack.delete({
        where: {
            id: feedBackId
        }
    });
};

module.exports = feedBackRepository;