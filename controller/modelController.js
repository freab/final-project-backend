const modelRepository = require("../repository/modelRepositry");
const responses = require("../utils/responses");

const path = require('path');
const multer = require("multer");

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: function (req, file, cb) {
        const timeStamp = Date.now();
        const ext = path.extname(file.originalname);
        const newFileName = `${timeStamp}${ext}`;
        cb(null, newFileName);
    }
});

const uploadStorage = multer({ storage: storage });

const modelController = {};

modelController.create = async (req, res) => {
    const {
        book_id,
        model_source_url,
        size,
        model_name,
        page_number,
        set_id
    } = req.body;

    const requiredFields = [
        'book_id',
        'model_source_url',
        'size',
        'model_name',
        'page_number',
        'set_id'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const createModel = await modelRepository.create({
            book_id, model_source_url, size, model_name, page_number, set_id
        });

        return res.status(200).json(responses.getCustomResponse(createModel, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

modelController.updateAndCreateModel = async (req, res) => {
    // Use the upload middleware here
    const upload = uploadStorage.single('file');

    upload(req, res, async function (err) {
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

        if (!req.file) {
            return res.status(400).json(responses.getCustomResponse({
                message: "No file uploaded"
            }, true));
        }

        const {
            book_id,
            model_name,
            page_number
        } = req.body;

        console.log("model_name" + model_name);

        const requiredFields = [
            'book_id',
            'model_name',
            'page_number'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json(responses.getCustomResponse({
                message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
            }, true));
        }

        const fileName = req.file.filename;
        const fileSize = req.file.size;

        try {
            const createModel = await modelRepository.create({
                book_id: parseInt(book_id),
                model_source_url: fileName,
                size: fileSize.toString(),
                model_name,
                page_number: parseInt(page_number),
                set_id: 0
            });

            return res.status(200).json(responses.getCustomResponse(createModel, false));
        } catch (error) {
            console.error("Error during model creation:", error);
            return res.status(500).json(responses.getCustomResponse({
                message: "Internal server error",
                error: error.message
            }, true));
        }
    });
};

modelController.editModel = async (req, res) => {
    const {
        id,
        book_id,
        model_source_url,
        size,
        model_name,
        page_number,
        set_id
    } = req.body;

    const requiredFields = [
        'id',
        'book_id',
        'model_source_url',
        'size',
        'model_name',
        'page_number',
        'set_id'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json(responses.getCustomResponse({
            message: `Error! Please enter the following fields: ${missingFields.join(', ')}`
        }, true));
    }

    try {
        const updateModel = await modelRepository.edit(parseInt(id), {
            book_id, model_source_url, size, model_name, page_number, set_id
        });

        return res.status(200).json(responses.getCustomResponse(updateModel, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

modelController.getAll = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please enter all fields..."
        }, true));
    }

    try {
        const allModels = await modelRepository.getAll(skip, take);
        return res.status(200).json(responses.getCustomResponse(allModels, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

modelController.getById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please enter all fields..."
        }, true));
    }

    try {
        const foundModel = await modelRepository.getById(id);
        return res.status(200).json(responses.getCustomResponse(foundModel, false));
    } catch (error) {
        console.log(error);
        res.status(500).json(responses.getCustomResponse(error, true));
    }
};

modelController.getBySetId = async (req, res) => {
    const setId = parseInt(req.params.setId);

    if (isNaN(setId)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please enter all fields..."
        }, true));
    }

    try {
        const foundModel = await modelRepository.getBySetId(setId);
        return res.status(200).json(responses.getCustomResponse(foundModel, false));
    } catch (error) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please check server log..."
        }, true));
    }
};

modelController.deleteModel = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please enter all fields..."
        }, true));
    }

    try {
        const deleteModel = await modelRepository.deleteModel(id);
        return res.status(200).json(responses.getCustomResponse(deleteModel, false));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responses.getCustomResponse({
            message: "Error! please check server log..."
        }, true));
    }
};

module.exports = modelController;
