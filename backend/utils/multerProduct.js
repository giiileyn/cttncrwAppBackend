const multer = require("multer");
const path = require("path");
// const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "products/");  // Store uploaded files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});


module.exports = multer({
    limits: { fileSize: 100 * 1024 * 1024 },
    storage: storage,
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
});