const { PrismaClient } = require("@prisma/client");
const couponRepository = require("./couponRepository");
const userBooksRepository = require("./userBooksRepository");
const bookRepository = {};
const prisma = new PrismaClient();

bookRepository.create = async (book) => {
    return await prisma.book.create({
        data: {
            name: book.name,
            author: book.author,
            type: book.type,
            cover_url: book.cover_url,
            tags: book.tags,
            description: book.description,
            price: book.price
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

bookRepository.activateBookByCoupon = async (bookId, userId, couponString) => {
    const { bookId, userId, couponString } = req.body;

    const requiredFields = [
        'bookId', 'userId', 'couponString'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const isCouponRedeemed = await couponRepository.isRedeemed(couponString);

        if (!isCouponRedeemed) {
            const userBook = {
                userId, bookId
            }

            const createUserBook = await userBooksRepository.create(userBook);
            const redeemCoupon = await couponRepository.redeemCoupon(couponString, bookId, userId);

            if (createUserBook && redeemCoupon) {
                return res.status(200).json(responses.getCustomResponse("Successfully activated coupon!", false));
            } else {
                return res.status(500).json(responses.getCustomResponse("Oops! something was wrong!", false));
            }
        } else {
            return res.status(400).json(responses.getCustomResponse("Successfully activated coupon!", false));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
}

bookRepository.remove = async (bookId) => {
    return await prisma.book.delete({
        where: {
            id: bookId
        }
    });
};

module.exports = bookRepository;