const { PrismaClient } = require("@prisma/client");
const bookRepository = {};
const prisma = new PrismaClient();

bookRepository.create = async (book) => {
    return await prisma.book.create({
        data: {
            name: book.name,
            author: book.author,
            type: book.type,
            cover_url: book.cover_url
        }
    });
};

bookRepository.createMany = async (books) => {
    return await prisma.book.createMany({
        data: books,
        skipDuplicates: true
    });
};

bookRepository.getAll = async (skip, take, text, orderBy) => {
    return await prisma.book.findMany({
        where: {
            name: {
                search: text || undefined
            },
            author: {
                search: text || undefined
            },
            type: {
                search: text || undefined
            },
            tags: {
                search: text || undefined
            }
        },
        skip: skip || undefined,
        take: take || undefined
    });
};

bookRepository.getById = async (id) => {
    return await prisma.book.findFirst({
        where: {
            id: id
        }
    });
};

bookRepository.getRandom = async (take) => {
    return await prisma.book.findMany({
        orderBy: raw`random()`,
        take: take
    });
}

bookRepository.getRandomRaw = async (take) => {
    const takeInt = parseInt(take);
    return await prisma.$queryRaw`SELECT * FROM Book ORDER BY RAND() LIMIT ${takeInt}`;
}

bookRepository.getBookByType = async (bookType) => {
    return await prisma.book.findMany({
        where: {
            type: bookType
        }
    });
};

bookRepository.edit = async (id, data) => {
    return await prisma.book.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
};

bookRepository.remove = async (bookId) => {
    return await prisma.book.delete({
        where: {
            id: bookId
        }
    });
};

module.exports = bookRepository;