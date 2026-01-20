const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { jsonWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createErrors(
        404,
        "User does not exist with this email. Please register first",
      );
    }
    // compare the password
    const ispasswordMatch = await bcrypt.compare(password, user.password);
    if (!ispasswordMatch) {
      throw createErrors(401, "Email/Password did not match");
    }
    // isBanned
    if (user.isBanned) {
      throw createErrors(403, "You are Banned. please contact authority");
    }

    // token . cookie
    // create JWT
    const accessToken = jsonWebToken({ user }, jwtAccessKey, "5min");
    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 1000, // 15 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });
    // refreshToken
    const refreshToken = jsonWebToken({ user }, jwtRefreshKey, "7days");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    /// succes responce
    return successResponse(res, {
      statusCode: 200,
      message: "User Login Successfully",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return successResponse(res, {
      statusCode: 200,
      message: "User Logout Successfully",
    });
  } catch (error) {
    next(error);
  }
};
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // verify the old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if (!decodedToken) {
      throw createErrors(401, "Invalid Refresh Token.Please Login Again");
    }
    const accessToken = jsonWebToken(decodedToken.user, jwtAccessKey, "5min");
    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 1000, // 5 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });
    return successResponse(res, {
      statusCode: 200,
      message: "New Access Token Is Genareted",
    });
  } catch (error) {
    next(error);
  }
};
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    // verify the old refresh token
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createErrors(401, "Invalid Access Token.Please Login Again");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Protected Resource Accessed Successgful",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
