const multer = require("multer");
const responses = require("../utils/responses");
const uploadsController = {};
const path = require('path');

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

uploadsController.uploadSingle = (req, res) => {
    const upload = uploadStorage.single('file');

    upload(req, res, function (err) {
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

        const fileName = req.file.filename;
        
        const response = {
            message: "File uploaded successfully",
            fileName: fileName
        };

        return res.status(200).json(responses.getCustomResponse(response, false));
    });
}

module.exports = uploadsController;