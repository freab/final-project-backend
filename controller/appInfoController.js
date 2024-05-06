const appInfoRepository = require("../repository/appInfoRepository");
const userRepository = require("../repository/userRepository");
const responses = require("../utils/responses");

const appInfoController = {};

appInfoController.create = async (req, res) => {
    const { appVersionName, appVersionNumber,
        currentAction, appNewFeature, updateUrl, resourceType, noticeMessage, noticeMessageType } = req.body;

    const requiredFields = [
        'appVersionName', 'appVersionNumber', 'currentAction', 'appNewFeature', 'updateUrl', 'resourceType', 'noticeMessage', 'noticeMessageType'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createAppInfo = await appInfoRepository.create({
            appVersionName,
            appVersionNumber,
            currentAction,
            appNewFeature,
            updateUrl,
            resourceType,
            noticeMessage,
            noticeMessageType
        });

        return res.status(200).json(responses.getCustomResponse(createAppInfo, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

appInfoController.editAppInfo = async (req, res) => {
    const { id, appVersionName, appVersionNumber,
        currentAction, appNewFeature, updateUrl, resourceType, noticeMessage, noticeMessageType } = req.body;

    const requiredFields = [
        'id', 'appVersionName', 'appVersionNumber',
        'currentAction', 'appNewFeature', 'updateUrl', 'resourceType', 'noticeMessage', 'noticeMessageType'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const updateAppInfo = await appInfoRepository.edit({
            appVersionName,
            appVersionNumber,
            currentAction,
            appNewFeature,
            updateUrl,
            resourceType,
            noticeMessage,
            noticeMessageType
        });

        return res.status(200).json(responses.getCustomResponse(updateAppInfo, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

appInfoController.getAppInfo = async (req, res) => {
    try {
        const getAppInformation = await appInfoRepository.getAppInfo();

        if (!getAppInformation || !getAppInformation.appNewFeature || !getAppInformation.appVersionNumber || !getAppInformation.currentAction || !getAppInformation.updateUrl || !getAppInformation.resourceType || !getAppInformation.noticeMessage || !getAppInformation.noticeMessageType) {
            res.status(500).json(responses.getCustomResponse("Incomplete app information", true));
            //throw new Error('Incomplete app information');
        }

        const formattedResponse = {
            appVersionName: getAppInformation.appVersionName,
            appVersionNumber: getAppInformation.appVersionNumber,
            actionType: getAppInformation.currentAction,
            updateNow: {
                appfeature: getAppInformation.appNewFeature,
                updateUrl: getAppInformation.updateUrl,
                resourceType: getAppInformation.resourceType
            },
            notice: {
                message: getAppInformation.noticeMessage,
                type: getAppInformation.noticeMessageType
            }
        };

        return res.status(200).json(responses.getCustomResponse(formattedResponse, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

appInfoController.getAppInfoUpdateScore = async (req, res) => {
    const { userId } = req.body;

    const requiredFields = ['userId']; 

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const getAppInformation = await appInfoRepository.getAppInfo();
        await userRepository.incrementScoreByFactor(userId, 10);

        if (!getAppInformation || !getAppInformation.appNewFeature || !getAppInformation.appVersionNumber || !getAppInformation.currentAction || !getAppInformation.updateUrl || !getAppInformation.resourceType || !getAppInformation.noticeMessage || !getAppInformation.noticeMessageType) {
            res.status(500).json(responses.getCustomResponse("Incomplete app information", true));
            //throw new Error('Incomplete app information');
        }

        const formattedResponse = {
            appVersionName: getAppInformation.appVersionName,
            appVersionNumber: getAppInformation.appVersionNumber,
            actionType: getAppInformation.currentAction,
            updateNow: {
                appfeature: getAppInformation.appNewFeature,
                updateUrl: getAppInformation.updateUrl,
                resourceType: getAppInformation.resourceType
            },
            notice: {
                message: getAppInformation.noticeMessage,
                type: getAppInformation.noticeMessageType
            }
        };

        return res.status(200).json(responses.getCustomResponse(formattedResponse, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

module.exports = appInfoController;