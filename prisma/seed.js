const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const deleteAllData = async () => {
    try {
        // Disable foreign key checks to allow deleting data from related tables
        await prisma.$queryRaw('SET FOREIGN_KEY_CHECKS = 0');

        // Get all table names
        const tables = await prisma.$queryRaw(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
      `);

        // Delete all data from each table
        for (const table of tables) {
            const tableName = table.table_name;
            await prisma.$queryRaw(`DELETE FROM ${tableName}`);
        }

        // Enable foreign key checks again
        await prisma.$queryRaw('SET FOREIGN_KEY_CHECKS = 1');

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
            coupon_id: faker.string.alpha(10),
            profile_url: faker.image.avatar(),
        };

        users.push(user);
    }

    return users;
};

const generateBooks = (count) => {
    const books = [];

    for (let i = 0; i < count; i++) {
        const book = {
            name: faker.word.words(3),
            author: faker.person.firstName(),
            type: faker.word.words(1),
            cover_url: faker.image.url(),
        };

        books.push(book);
    }

    return books;
};

const seedUsers = async () => {
    const users = generateUsers(10);

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log('Users created successfully!');
};

const seedBooks = async () => {
    const books = generateBooks(10);

    await prisma.book.createMany({
        data: books,
        skipDuplicates: true,
    });

    console.log('Books created successfully!');
};

const generateCoupons = (count, userIds, bookIds) => {
    const coupons = [];

    for (let i = 0; i < count; i++) {
        const coupon = {
            user_id: faker.number.int(100),
            redeemed_date: faker.date.past().toISOString(),
            is_redeemed: faker.datatype.boolean(),
            price: faker.number.int({ min: 100, max: 1500 }),
            book_id: faker.number.int(),
            coupon: faker.string.alphanumeric(10),
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

    const coupons = generateCoupons(10, userIds, bookIds);

    await prisma.coupon.createMany({
        data: coupons,
        skipDuplicates: true,
    });

    console.log('Coupons created successfully!');
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

const seedModels = async () => {
    const books = await prisma.book.findMany();
    const sets = await prisma.set.findMany();

    const bookIds = books.map((book) => book.id);
    const setIds = sets.map((set) => set.id);

    const models = generateModels(10, bookIds, setIds);

    await prisma.model.createMany({
        data: models,
        skipDuplicates: true,
    });

    console.log('Models created successfully!');
};

const seedSets = async () => {
    const sets = generateSets(5);

    await prisma.set.createMany({
        data: sets,
        skipDuplicates: true,
    });

    console.log('Sets created successfully!');
};


async function main() {
    /* if (process.argv.includes('--delete-data')) {
        await deleteAllData();
    } */
    await deleteAllData();
    await seedUsers();
    await seedBooks();
    await seedCoupons();
    await seedSets();
    await seedModels();
}

main()
    .catch((error) => {
        console.error('Error seeding data:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });