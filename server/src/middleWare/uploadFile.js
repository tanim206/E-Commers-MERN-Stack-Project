const multer = require("multer");
const {
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPE,
  UPLOAD_PRODUCT_IMAGE_DIRECTORY,
} = require("../config");

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

// ********************
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PRODUCT_IMAGE_DIRECTORY);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// const fileFilter = (req, file, cb) => {
//   if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
//     cb(new Error("files type are allowed"), false);
//   }
//   //   // if (file.size > MAX_FILE_SIZE) {
//   //   //   cb(new Error("File size exceeds the maximum limit"), false);
//   //   // }
//   //   // if (!file.ALLOWED_FILE_TYPE.includes(file.mimetype)) {
//   //   //   cb(new Error("File extension is not allowed"), false);
//   //   // }
//   //   cb(null, true);
// };

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});
const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});
module.exports = { uploadUserImage, uploadProductImage };
