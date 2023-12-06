const { PrismaClient } = require("@prisma/client");
const { bookCoverUrl } = require("../utils/constants");

const bookRepository = {};
const prisma = new PrismaClient();

bookRepository.create = async (book) => {
    return await prisma.book.create({
        data: {
            name: book.name,
            author: book.author,
            type: book.type,
            cover_url: bookCoverUrl
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

bookRepository.remove = async (userId) => {
    return await prisma.book.delete({
        where: {
            id: userId
        }
    });
};

module.exports = bookRepository;