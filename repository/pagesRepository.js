const { PrismaClient } = require("@prisma/client");
const pagesRepository = {};
const prisma = new PrismaClient();

pagesRepository.createPage = async (page) => {
    return await prisma.page.create({
        data: {
            bookId: page.bookId,
            bookInfoContentId: page.bookInfoContentId,
            pagePreviewImageUrl: page.pagePreviewImageUrl,
            pageTitle: page.pageTitle,
            pageDescription: page.pageDescription,
            modelId: page.modelId
        }
    });
}

pagesRepository.getAll = async (skip, take, text) => {
    return await prisma.page.findMany({
        skip: skip || undefined,
        take: take || undefined
    });
}

pagesRepository.getById = async (pageId) => {
    return await prisma.page.findFirst({
        where: {
            id: pageId
        }
    });
}

pagesRepository.edit = async (pageId, data) => {
    return await prisma.page.update({
        where: {
            id: pageId
        },
        data: {
            ...data
        }
    });
}

pagesRepository.getByBookId = async (skip, take, bookId) => {
    return await prisma.page.findMany({
        where: {
            bookId: bookId
        },
        skip: skip || undefined,
        take: take || undefined
    });
}

pagesRepository.delete = async (pageId) => {
    return await prisma.page.delete({
        where: {
            id: pageId
        }
    });
}

module.exports = pagesRepository;