const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userBooksRepository = {
    create: async (userBook) => {
        return await prisma.userBooks.create({
            data: {
                userId: userBook.userId,
                bookId: userBook.bookId
            }
        });
    },

    edit: async (id, data) => {
        return await prisma.userBooks.update({
            where: {
                id: id
            },
            data: {
                ...data
            }
        });
    },

    getBooksByUserId: async (userId, skip, take) => {
        return await prisma.userBooks.findMany({
            where: {
                userId: userId
            },
            skip, take
        });
    },

    getAllOwnedBooks: async (skip, take) => {
        return await prisma.userBooks.findMany({
            skip, take
        });
    },

    getBooksByBookId: async (bookId, skip, take) => {
        return await prisma.userBooks.findMany({
            where: {
                bookId: bookId
            },
            skip, take
        });
    },

    updateBookProgressByAmount: async (bookId, userId, amount) => {
        return await prisma.userBooks.update({
            where: {
                userId: userId,
                bookId: bookId
            },
            data: {
                progress: amount
            }
        });
    },

    updateBookProgressByIncrement: async (bookId, userId) => {
        return await prisma.userBooks.update({
            where: {
                userId: userId,
                bookId: bookId
            },
            data: {
                progress: {
                    increment: 1
                }
            }
        });
    }
};

module.exports = userBooksRepository;
