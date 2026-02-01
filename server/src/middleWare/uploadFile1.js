const multer = require("multer");
const { ALLOW_FILE_TYPES, MAX_FILE_SIZE } = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image file are allowed"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File size exsist the max limits"), false);
  }
  if (!ALLOW_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type are not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,

  fileFilter,
});

module.exports = upload;