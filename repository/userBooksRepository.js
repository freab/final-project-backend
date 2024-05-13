const { PrismaClient } = require("@prisma/client");
const userBooksRepository = {};
const prisma = new PrismaClient();

userBooksRepository.create() = async (userBook) => {
    return await prisma.userBooks.create({
        userId: userBook.userId,
        bookId: userBook.bookId
    });
}

userBooksRepository.edit() = async (id, data) => {
    return await prisma.userBooks.update({
        where: {
            id
        },
        data: {
            ...data
        }
    })
};

userBooksRepository.getBooksByUserId = async (userId, skip, take) => {
    return await prisma.userBooks.findMany({
        where: {
            userId: userId
        },
        skip, take
    });
};

userBooksRepository.getAllOwnedBooks = async (skip, take) => {
    return await prisma.userBooks.findMany({
        skip, take
    });
};

userBooksRepository.getBooksByBookId = async (bookId, skip, take) => {
    return await prisma.userBooks.findMany({
        where: {
            bookId: bookId
        },
        skip, take
    });
};

userBooksRepository.updateBookProgressByAmount = async (bookId, userId, amount) => {
    return await prisma.userBooks.update({
        where: {
            userId: userId,
            bookId: bookId
        },
        data: {
            progress: amount
        }
    });
};

userBooksRepository.updateBookProgressByIncrement = async (bookId, userId) => {
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
};

module.exports = userBooksRepository;