const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");
const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createErrors(401, "Access token not found. Please Log in");
    }
    const decoded = jwt.verify(accessToken, jwtAccessKey);
    if (!decoded) {
      throw createErrors(401, "Invalid access token. Please login again");
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (decoded) {
          throw createErrors(400, "User alreay Logged in");
        }
      } catch (error) {
        throw error;
      }
    }
    // req.body.userId = decoded._id;
    next();
  } catch (error) {
    return next(error);
  }
};
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createErrors(
        403,
        "Forbidden. You must be an Admin to access this project"
      );
    }
    next();
  } catch (error) {
    throw error;
  }
};
// req.body.userId = decoded._id;

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
