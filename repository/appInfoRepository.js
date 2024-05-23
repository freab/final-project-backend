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
};


appInfoRepository.getStats = async () => {
    return await prisma.$transaction(async (prisma) => {
        const userCount = await prisma.user.count();
        const modelCount = await prisma.model.count();
        const bookCount = await prisma.book.count();
        const transactionCount = await prisma.transactions.count();
        const couponCount = await prisma.coupon.count();

        const booksCountByType = await prisma.book.groupBy({
            by: ['type'],
            _count: {
                type: true,
            },
        });

        const booksCountByTypeFormatted = booksCountByType.map(book => ({
            type: book.type,
            count: book._count.type
        }));

        return {
            users: userCount,
            models: modelCount,
            books: bookCount,
            transactions: transactionCount,
            coupons: couponCount,
            booksCountByType: booksCountByTypeFormatted
        };
    });
};

module.exports = appInfoRepository;