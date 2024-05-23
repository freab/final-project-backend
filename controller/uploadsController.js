const multer = require("multer");
const responses = require("../utils/responses");
const uploadsController = {}
const path = require('path');

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

uploadsController.uploadSingle = async (req, res) => {
    try {
        uploadStorage.single('file')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err);
                return res.status(500).json(responses.getCustomResponse(err, true));
            } else if (err) {
                console.error("Unknown Error:", err);
                return res.status(500).json(responses.getCustomResponse(err, true));
            }

            const fileName = req.file.filename;
            
            const response = {
                "message": "File uploaded successfully",
                "fileName": fileName
            }

            return res.status(200).json(responses.getCustomResponse(response, false));
        });
    } catch (error) {
        console.error("Error in uploadSingle:", error);
        return res.status(500).json(responses.getCustomResponse("Internal server error", true));
    }
}

module.exports = uploadsController