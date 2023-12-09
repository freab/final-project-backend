const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const setRepository = {};

setRepository.create = async (set) => {
    return await prisma.set.create({
        data: {
            price: set.price || 0,
            total_items: set.total_items || 0,
            set_name: set.set_name || "unnamed",
        }
    });
};

setRepository.update = async (setId, data) => {
    return await prisma.set.update({
        where: {
            id: setId
        },
        data: {
            ...data
        }
    });
}

setRepository.getAll = async (skip, take) => {
    return await prisma.set.findMany({
        skip: skip || undefined,
        take: take || undefined
    });
};

setRepository.getById = async (setId) => {
    return await prisma.set.findFirst({
        where: {
            id: setId
        }
    });
};

setRepository.remove = async (setId) => {
    return await prisma.set.delete({
        where: {
            id: setId
        }
    });
};

module.exports = setRepository;