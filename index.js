const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").require();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const routes = require("./routes/routes");

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

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

app.get("/api/v1", (req, res) => {
    res.send({
        message: "Server is running...",
    })
});

app.listen(PORT);