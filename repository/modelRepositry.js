const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const modelRepository = {};

modelRepository.create = async (model) => {
    return await prisma.model.create({
        data: {
            book_id: model.book_id,
            model_source_url: model.model_source_url,
            size: model.size || "unknown",
            model_name: model.name,
            page_number: model.page_number,
            set_id: model.set_id
        }
    });
};

modelRepository.getAll = async (skip, take, text) => {
    return await prisma.model.findMany({
        where: {
            model_name: {
                search: text || undefined
            }
        },
        skip: skip || undefined,
        take: take || undefined,
    });
};

modelRepository.getById = async (modelId) => {
    return await prisma.model.findFirst({
        where: {
            id: modelId
        }
    });
};

modelRepository.getBySetId = async (setId) => {
    return await prisma.model.findMany({
        where: {
            set_id: setId
        }
    });
};

modelRepository.edit = async (id, data) => {
    return await prisma.model.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    });
};

modelRepository.deleteModel = async (modelId) => {
    return await prisma.model.delete({
        where: {
            id: modelId
        }
    });
};

module.exports = modelRepository;