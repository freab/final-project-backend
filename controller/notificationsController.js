const responses = require("../utils/responses");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const notificationsController = {};

notificationsController.sendToAll = async (req, res) => {
    const data = req.body;

    const requiredFields = [
        'data'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const firebaseMessaging = firebaseAdmin.messaging();
        const message = {
            data: {
                ...data
            },
            topic: 'all'
        };

        const response = await firebaseMessaging.send(message);
        console.log('Successfully sent message to all:', response);
        return res.status(200).json(responses.getCustomResponse({
            message: 'Message sent successfully'
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

notificationsController.sendToTopic = async (req, res) => {
    const data = req.body;
    const { topic } = req.params; 

    const requiredFields = [
        'data', 'topic'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const firebaseMessaging = firebaseAdmin.messaging();
        const message = {
            data: {
                ...data
            },
            topic: topic
        };

        const response = await firebaseMessaging.send(message);
        console.log(`Successfully sent message to topic '${topic}':`, response);
        return res.status(200).json(responses.getCustomResponse({
            message: `Message sent successfully to topic '${topic}'`
        }));
    } catch (error) {
        console.log(`Error sending message to topic '${topic}':`, error);
        return res.status(500).json(responses.getCustomResponse({
            message: `Error sending message to topic '${topic}'`
        }, true));
    }
};

notificationsController.sendToDevice = async (req, res) => {
    const { deviceToken, data } = req.body; // Assuming the device token is provided in the request parameters

    const requiredFields = [
        'data', 'deviceToken'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const firebaseMessaging = firebaseAdmin.messaging();
        const message = {
            data: {
                ...data
            },
            token: deviceToken
        };

        const response = await firebaseMessaging.send(message);
        console.log(`Successfully sent message to device with token '${deviceToken}':`, response);
        return res.status(200).json(responses.getCustomResponse({
            message: `Message sent successfully to device with token '${deviceToken}'`
        }));
    } catch (error) {
        console.log(`Error sending message to device with token '${deviceToken}':`, error);
        return res.status(500).json(responses.getCustomResponse({
            message: `Error sending message to device with token '${deviceToken}'`
        }, true));
    }
};

notificationsController.sendToUser = async (req, res) => {
    const { data, userId } = req.body;

    if (!data || !userId) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! Please provide 'data' and 'userId' in the request body."
        }, true));
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json(responses.getCustomResponse({
                message: "User not found."
            }, true));
        }

        const deviceToken = user.deviceToken;

        if (!deviceToken) {
            return res.status(400).json(responses.getCustomResponse({
                message: "User does not have a device token."
            }, true));
        }

        const firebaseMessaging = firebaseAdmin.messaging();
        const message = {
            data: {
                ...data
            },
            token: deviceToken
        };

        const response = await firebaseMessaging.send(message);
        console.log(`Successfully sent message to user with ID '${userId}':`, response);
        return res.status(200).json(responses.getCustomResponse({
            message: `Message sent successfully to user with ID '${userId}'`
        }));
    } catch (error) {
        console.log(`Error sending message to user with ID '${userId}':`, error);
        return res.status(500).json(responses.getCustomResponse({
            message: `Error sending message to user with ID '${userId}'`
        }, true));
    }
};


module.exports = notificationsController;