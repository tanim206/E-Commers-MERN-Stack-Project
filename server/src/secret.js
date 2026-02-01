require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommarsDB";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "/public/image/users/default.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "tanim2HJGFH026r";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "tanim2HJGFH026r";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "tanim2HJGFH026r";
const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "tanim2HJGFH026r";
const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  jwtAccessKey,
  jwtRefreshKey,
  jwtResetPasswordKey,
};
