require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommarsDB";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "/public/image/users/default.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || tanim2HJGFH026r;

module.exports = { serverPort, mongodbURL, defaultImagePath, jwtActivationKey };
