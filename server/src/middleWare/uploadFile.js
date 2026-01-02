const multer = require("multer");
const path = require("path");
const createErrors = require("http-errors");
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || "2097152";
const ALLOWED_FILE_TYPE = process.env.ALLOWED_FILE_TYPE || [
  "jpg",
  "jpeg",
  "png",
];
const UPLOAD_DIRECTORY = process.env.UPLOAD_FILE || "public/image/users";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extensionName = path.extname(file.originalname);
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname.replace(extensionName, "" + extensionName)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extensionName = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPE.includes(extensionName.substring(1))) {
    return cb(createErrors(400, "File type not allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
module.exports = upload;
