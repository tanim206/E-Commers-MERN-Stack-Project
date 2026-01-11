const multer = require("multer");

const { MAX_FILE_SIZE, ALLOWED_FILE_TYPE } = require("../config");

const userStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
    cb(new Error("files type are allowed"), false);
  }
  // if (file.size > MAX_FILE_SIZE) {
  //   cb(new Error("File size exceeds the maximum limit"), false);
  // }
  // if (!file.ALLOWED_FILE_TYPE.includes(file.mimetype)) {
  //   cb(new Error("File extension is not allowed"), false);
  // }
  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});
module.exports = uploadUserImage;
