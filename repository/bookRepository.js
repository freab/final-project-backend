const { PrismaClient } = require("@prisma/client");
const couponRepository = require("./couponRepository");
const userBooksRepository = require("./userBooksRepository");
const userRepository = require("../repository/userRepository");
const transactionRepository = require("../repository/transactionRepository");

const bookRepository = {};
const prisma = new PrismaClient();
const { Chapa } = require("chapa-nodejs");
//const fetch = require("node-fetch");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const chapa = new Chapa({
    secretKey: process.env.CHAPA_SECRET_KEY
})

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

bookRepository.getAll = async (skip, take, text) => {
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
    let result = {
        success: false,
        error: null
    };

    try {
        const isCouponRedeemed = await couponRepository.isRedeemed(couponString);

        if (!isCouponRedeemed) {
            const userBook = {
                userId, bookId
            };

            const createUserBook = await userBooksRepository.create(userBook);
            const redeemCoupon = await couponRepository.redeemCoupon(couponString, bookId, userId);

            if (createUserBook && redeemCoupon) {
                result.success = true;
            } else {
                result.error = "Oops! Something went wrong!";
            }
        } else {
            result.error = "Coupon has already been redeemed!";
        }
    } catch (error) {
        console.error(error);
        result.error = error.toString();
    }

    return result;
};

bookRepository.getChapaLink = async (userId, bookId) => {
    let result = {
        success: false,
        error: null,
        checkoutUrl: null
    };

    try {
        // Retrieve the book details by bookId
        const book = await bookRepository.getById(bookId);

        if (!book) {
            result.error = "Book does not exist!";
            return result;
        }

        const user = await userRepository.getById(userId);

        if (!user) {
            result.error = "User does not exist!";
            return result;
        }

        // Assuming the book object has a price property
        const price = book.price;

        // Generate transaction reference using our utility method or provide your own
        const txRef = await chapa.generateTransactionReference();

        // Initialize Chapa payment
        const chapaRequestData = {
            amount: price,
            currency: 'ETB', // Assuming the currency is Ethiopian Birr
            email: user.email, // User's email
            first_name: user.fname, // User's first name
            last_name: user.lname, // User's last name
            tx_ref: txRef,
            callback_url: 'http://localhost:3000/api/v1/books/callback', // Replace with your callback URL
            return_url: 'http://localhost:3000/api/v1/books/return', // Replace with your return URL
            customization: {
                title: 'Book Purchase',
            },
        };

        const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chapaRequestData)
        });

        const responseData = await chapaResponse.json();
        console.log("chapa response\n", responseData);

        if (responseData.status === 'success') {
            result.success = true;
            result.checkoutUrl = responseData.data.checkout_url;
        } else {
            result.error = responseData.message || "Failed to initialize payment!";
        }
    } catch (error) {
        console.error(error);
        result.error = error.toString();
    }

    return result;
};

bookRepository.paymentCallback = async (event) => {
    console.log("payment callback called...");
    console.log(event);
    try {
        const { chapa_reference: txRef } = event;

        // Select transaction by reference
        const transaction = await transactionRepository.getByTransactionRef(txRef);

        if (!transaction) {
            throw new Error("Transaction not found!");
        }

        // Update transaction status
        const updatedTransaction = await transactionRepository.updateStatus(transaction.id, 1); // Assuming status 1 means success

        if (!updatedTransaction) {
            throw new Error("Failed to update transaction status!");
        }

        // Add a new row to userBooks repository using the date from reference
        const newUserBook = await userBooksRepository.create({
            userId: transaction.userId,
            bookId: transaction.bookId,
            progress: 0, // Assuming initial progress is 0
        });

        if (!newUserBook) {
            throw new Error("Failed to create new user book entry!");
        }

        return {
            success: true,
            message: "Payment callback processed successfully!"
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error.message || "An error occurred during payment callback processing."
        };
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