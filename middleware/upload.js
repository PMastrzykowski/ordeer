
const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2.5 },
    fileFilter,
});

module.exports = upload