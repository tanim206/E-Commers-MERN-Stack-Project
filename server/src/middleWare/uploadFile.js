const multer = require("multer");

const { MAX_FILE_SIZE } = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    cb(new Error("File size exceeds the maximum limit"), false);
  }
  if (!file.ALLOWED_FILE_TYPE.includes(file.mimetype)) {
    cb(new Error("File extension is not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
module.exports = upload;
