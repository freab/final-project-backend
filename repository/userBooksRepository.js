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

userBooksRepository.getBooksByUserId = async (userId) => {
    const userBookData = await prisma.userBooks.findMany({
        where: {
            userId: userId
        }
    });
}

module.exports = userBooksRepository;