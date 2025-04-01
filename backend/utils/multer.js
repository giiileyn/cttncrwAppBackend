const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "../avatars"); 
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn’t exist
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

module.exports = multer({
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max file size
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
