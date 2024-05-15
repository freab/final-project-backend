const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const transactionRepository = {};

transactionRepository.create = async (transaction) => {
    return await prisma.transactions.create({
        data: {
            userId: transaction.userId,
            bookId: transaction.bookId,
            status: transaction.status,
            transactionRef: transaction.transactionRef
        }
    });
};

transactionRepository.getById = async (transactionId) => {
    return await prisma.transactions.findFirst({
        where: {
            id: transactionId
        }
    });
};

transactionRepository.getByUserId = async (userId, skip, take) => {
    return await prisma.transactions.findMany({
        where: {
            userId: userId
        },
        skip: skip,
        take: take
    });
};

transactionRepository.getByBookId = async (bookId, skip, take) => {
    return await prisma.transactions.findMany({
        where: {
            bookId: bookId
        },
        skip: skip,
        take: take
    });
};

transactionRepository.getByTransactionRef = async (txRef) => {
    return await prisma.transactions.findFirst({
        where: {
            transactionRef: txRef
        }
    });
};

transactionRepository.updateStatus = async (transactionId, status) => {
    return await prisma.transactions.update({
        where: {
            id: transactionId
        },
        data: {
            status: status
        }
    });
};



transactionRepository.remove = async (transactionId) => {
    return await prisma.transactions.delete({
        where: {
            id: transactionId
        }
    });
};

module.exports = transactionRepository;
