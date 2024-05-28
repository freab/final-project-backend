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

transactionRepository.getAll = async (skip, take) => {
    return await prisma.transactions.findMany({
        skip, take
    });
};

transactionRepository.getAllWithInclude = async (skip, take) => {
    const transactions = await prisma.transactions.findMany({
        skip, take
    });

    const userIds = transactions.map(transaction => transaction.userId);
    const bookIds = transactions.map(transaction => transaction.bookId);

    const users = await prisma.user.findMany({
        where: { id: { in: userIds } }
    });

    const books = await prisma.book.findMany({
        where: { id: { in: bookIds } }
    });

    return transactions.map(transaction => ({
        ...transaction,
        user: users.find(user => user.id === transaction.userId),
        book: books.find(book => book.id === transaction.bookId)
    }));
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

transactionRepository.getByStatus = async (status, skip, take) => {
    return await prisma.transactions.findMany({
        where: {
            status
        },
        skip, take
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
