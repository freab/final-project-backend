const { PrismaClient } = require('@prisma/client');
const { faker, da } = require('@faker-js/faker');
const prisma = new PrismaClient();

const deleteAllData = async () => {
    try {
        // Disable foreign key checks to allow deleting data from related tables
        await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS = 0`;

        // Get all table names
        const tables = await prisma.$queryRaw`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
      `;

        // Delete all data from each table
        for (const table of tables) {
            const tableName = table.table_name;
            await prisma.$queryRaw`DELETE FROM ${tableName}`;
        }

        // Enable foreign key checks again
        await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS = 1`;

        console.log('All data deleted successfully!');
    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        await prisma.$disconnect();
    }
};

const generateUsers = (count) => {
    const users = [];

    for (let i = 0; i < count; i++) {
        const user = {
            fname: faker.person.firstName(),
            lname: faker.person.lastName(),
            email: faker.internet.email(),
            phone_number: faker.phone.number(),
            profile_url: faker.image.avatar(),
            score: faker.number.int(),
            last_login: faker.date.anytime(),
            deviceToken: faker.string.alphanumeric(15),
        };

        users.push(user);
    }

    return users;
};

const generatePages = (count) => {
    const pages = [];

    for (let i = 0; i < count; i++) {
        const page = {
            bookId: faker.number.int(count),
            bookInfoContentId: `${faker.string.alphanumeric(6)}.md`,
            pagePreviewImageUrl: faker.image.urlPicsumPhotos(),
            pageTitle: "Simple place holder title",
            pageDescription: faker.lorem.sentence(3),
            modelId: faker.number.int({ min: 100, max: 1500 }),
            pageNumber: i
        }

        pages.push(page);
    }

    return pages;
}

const generateBooks = (count) => {
    const books = [];

    for (let i = 0; i < count; i++) {
        const book = {
            name: faker.word.words(3),
            author: faker.person.firstName(),
            type: faker.word.words(1),
            cover_url: faker.image.url(),
            tags: faker.word.words(5),
            description: faker.lorem.paragraph(8),
            price: faker.number.int(10, 400)
        };

        books.push(book);
    }

    return books;
};

const seedUsers = async () => {
    const users = generateUsers(20);

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log('Users seeded successfully!');
};

const seedBooks = async () => {
    const books = generateBooks(20);

    await prisma.book.createMany({
        data: books,
        skipDuplicates: true,
    });

    console.log('Books seeded successfully!');
};

const seedPages = async () => {
    const pages = generatePages(20);

    await prisma.page.createMany({
        data: pages,
        skipDuplicates: true
    });

    console.log('Pages seeded successfully!');
}

const generateCoupons = (count, userIds, bookIds) => {
    const coupons = [];

    for (let i = 0; i < count; i++) {
        const coupon = {
            user_id: faker.number.int(100),
            redeemed_date: faker.date.past().toISOString(),
            is_redeemed: faker.datatype.boolean(),
            price: faker.number.int({ min: 100, max: 1500 }),
            coupon: faker.string.alphanumeric(6).toUpperCase(),
        };

        coupons.push(coupon);
    }

    return coupons;
};

const seedCoupons = async () => {
    const users = await prisma.user.findMany();
    const books = await prisma.book.findMany();

    const userIds = users.map((user) => user.id);
    const bookIds = books.map((book) => book.id);

    const coupons = generateCoupons(20, userIds, bookIds);

    await prisma.coupon.createMany({
        data: coupons,
        skipDuplicates: true,
    });

    console.log('Coupons seeded successfully!');
};

const generateModels = (count, bookIds, setIds) => {
    const models = [];
    const options = ["1mb", "2mb", "6mb", "Unknown"];

    for (let i = 0; i < count; i++) {
        const model = {
            book_id: faker.number.int(100),
            model_source_url: faker.image.url(),
            size: options[Math.floor(Math.random() * options.length)],
            model_name: faker.word.words(1),
            page_number: faker.number.int({ min: 1, max: 100 }),
            set_id: faker.number.int(100),
        };

        models.push(model);
    }

    return models;
};

const generateSets = (count) => {
    const sets = [];

    for (let i = 0; i < count; i++) {
        const set = {
            price: faker.number.int({ min: 10, max: 100 }),
            total_items: faker.number.int({ min: 1, max: 10 }),
            set_name: faker.word.words(),
        };

        sets.push(set);
    }

    return sets;
};

const generateTransactions = (count) => {
    const transactions = [];
    const statuses = [0, 1, 2];

    for (let i = 0; i < count; i++) {
        const transaction = {
            userId: i,
            bookId: i,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            transactionRef: faker.string.alphanumeric(6)
        };

        transactions.push(transaction);
    }

    return transactions;
};

const generateFeedbacks = (count) => {
    const feedBacks = [];
    const feedBackTypes = ["complaint", "suggestion", "comment", "urgent"];

    for (let i = 0; i < count; i++) {
        const feedBack = {
            type: feedBackTypes[Math.floor(Math.random() * feedBackTypes.length)],
            content: faker.lorem.sentence(5),
            email: faker.internet.email()
        };

        feedBacks.push(feedBack);
    }

    return feedBacks;
}

const seedModels = async () => {
    const books = await prisma.book.findMany();
    const sets = await prisma.set.findMany();

    const bookIds = books.map((book) => book.id);
    const setIds = sets.map((set) => set.id);

    const models = generateModels(20, bookIds, setIds);

    await prisma.model.createMany({
        data: models,
        skipDuplicates: true,
    });

    console.log('Models seeded successfully!');
};

const seedSets = async () => {
    const sets = generateSets(25);

    await prisma.set.createMany({
        data: sets,
        skipDuplicates: true,
    });

    console.log('Sets seeded successfully!');
};

const seedTransactions = async () => {
    const transactions = generateTransactions(25);

    await prisma.transactions.createMany({
        data: transactions,
        skipDuplicates: true,
    });

    console.log('Transactions seeded successfully!');
};

const seedFeedbacks = async () => {
    const feedbacks = generateFeedbacks(25);

    await prisma.feedBack.createMany({
        data: feedbacks,
        skipDuplicates: true,
    });

    console.log('Feedbacks seeded successfully!');
};

async function main() {
    /* if (process.argv.includes('--delete-data')) {
        await deleteAllData();
    } */
    //await deleteAllData();
    await seedPages();
    await seedUsers();
    await seedBooks();
    await seedCoupons();
    await seedSets();
    await seedModels();
    await seedTransactions();
    await seedFeedbacks();
}

main()
    .catch((error) => {
        console.error('Error seeding data:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });