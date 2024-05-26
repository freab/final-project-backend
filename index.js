const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const morgan = require('morgan');

const fs = require('fs');
const util = require('util');
const os = require('os');
const path = require('path');

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const routes = require("./routes/routes");

const customStream = {
    write: (message) => {
        console.log(message.trim());
    }
};

app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: customStream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const homeDirectory = os.homedir();
const logDirectory = path.join(homeDirectory, 'node-app-log');
const logFilePath = path.join(logDirectory, 'app.log');

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a writable stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Create a reference to the original console.log
const originalConsoleLog = console.log;

// Override console.log to write to both console and file
console.log = (...args) => {
    const message = args.map(arg => util.inspect(arg)).join(' '); // Convert arguments to strings
    originalConsoleLog(message); // Log to console using original console.log
    logStream.write(`${new Date().toISOString()} - ${message}\n`); // Log to file
};

// Now console.log will write to both console and file
console.log('Hello, logging world!');

async function connectToDB() {
    try {
        await prisma.$connect();
        console.log("Database Conneted Successfully!!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

connectToDB();

app.get("/", (req, res) => {
    res.send({
        message: "Server is running...",
    })
});

app.listen(PORT, () => {
    console.log("Server started running at: http://localhost:" + PORT);
});