const modelRepository = require("../repository/modelRepositry");
const pagesRepository = require("../repository/pagesRepository");
const responses = require("../utils/responses");

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const pageController = {};

pageController.create = async (req, res) => {
    const { bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription, modelId } = req.body;

    const requiredFields = [
        'bookId', 'bookInfoContentId', 'pagePreviewImageUrl', 'pageTitle', 'pageDescription', 'modelId'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createPage = await pagesRepository.createPage({
            bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription, modelId
        });

        return res.status(200).json(responses.getCustomResponse(createPage, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

pageController.uploadAndCreate = async (req, res) => {
    const uploadFiles = upload.fields([
        { name: 'pageInfoContent', maxCount: 1 },
        { name: 'pagePreviewImage', maxCount: 1 },
        { name: 'model', maxCount: 1 }
    ]);

    uploadFiles(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error("Multer Error:", err);
            return res.status(500).json(responses.getCustomResponse({
                message: "Multer error occurred during file upload",
                error: err.message
            }, true));
        } else if (err) {
            console.error("Unknown Error:", err);
            return res.status(500).json(responses.getCustomResponse({
                message: "Unknown error occurred during file upload",
                error: err.message
            }, true));
        }

        if (!req.files || !req.files['pageInfoContent'] || !req.files['pagePreviewImage'] || !req.files['model']) {
            return res.status(400).json(responses.getCustomResponse({
                message: "Please upload all required files"
            }, true));
        }

        const bookInfoContentFile = req.files['pageInfoContent'][0].filename;
        const pagePreviewImageFile = req.files['pagePreviewImage'][0].filename;
        const modelFile = req.files['model'][0].filename;

        const { bookId, pageTitle, pageDescription, pageNumber } = req.body;

        const requiredFields = [
            'bookId', 'pageTitle', 'pageDescription', 'pageNumber'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json(responses.getCustomResponse({
                message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
            }, true));
        }

        try {
            const modelData = {
                book_id: parseInt(bookId),
                model_source_url: modelFile,
                size: req.files['model'][0].size.toString(),
                model_name: 'Default Model Name',
                page_number: parseInt(pageNumber), 
                set_id: 0
            };

            const createModel = await modelRepository.create(modelData);
            const modelId = createModel.id; 

            const createPage = await pagesRepository.createPage({
                bookId,
                bookInfoContentId: bookInfoContentFile,
                pagePreviewImageUrl: pagePreviewImageFile,
                pageTitle,
                pageDescription,
                modelId: modelId,
                pageNumber: parseInt(pageNumber)
            });

            return res.status(200).json(responses.getCustomResponse(createPage, false));
        } catch (error) {
            console.error("Error during model or page creation:", error);
            return res.status(500).json(responses.getCustomResponse(error, true));
        }
    });
}

pageController.editPage = async (req, res) => {
    const { id, bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription, modelId } = req.body;

    const requiredFields = [
        'id', 'bookId', 'bookInfoContentId', 'pagePreviewImageUrl', 'pageTitle', 'pageDescription', 'modelId'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createPage = await pagesRepository.edit(id, {
            bookId, bookInfoContentId, pagePreviewImageUrl, pageTitle, pageDescription
        });

        return res.status(200).json(responses.getCustomResponse(createPage, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

pageController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const getAllPages = await pagesRepository.getAll(skip, take);
        return res.status(200).json(responses.getCustomResponse(getAllPages, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
};

pageController.getById = async (req, res) => {
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundPage = await pagesRepository.getById(pageId);
        return res.status(200).json(responses.getCustomResponse(foundPage, false));
    } catch (error) {
        console.log(error);
        return res.status(500).json(responses.getCustomResponse(error, true));
    }
}

pageController.getByBookId = async (req, res) => {
    const bookId = parseInt(req.params.bookId);

    if (isNaN(bookId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const foundPage = await pagesRepository.getByBookId(bookId);
        return res.status(200).json(responses.getCustomResponse(foundPage, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
}

pageController.delete = async (req, res) => {
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Please enter all fields!!"
        }, true));
    }

    try {
        const removePage = await pagesRepository.delete(pageId);
        return res.status(200).json(responses.getCustomResponse(removePage, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

module.exports = pageController;