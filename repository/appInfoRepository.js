const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appInfoRepository = {}

appInfoRepository.create = async (appInfo) => {
    return await prisma.appInfo.create({
        data: {
            ...appInfo
        }
    });
};

appInfoRepository.edit = async (newAppInfo) => {
    return await prisma.appInfo.update({
        data: {
            ...newAppInfo
        },
        where: {
            id: 1
        }
    });
};

appInfoRepository.getAppInfo = async () => {
    return await prisma.appInfo.findFirst();
}

module.exports = appInfoRepository;