const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { jsonWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createErrors(
        404,
        "User does not exist with this email. Please register first"
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

    const accessToken = jsonWebToken({ email }, jwtAccessKey, "10min");
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 min
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User Login Successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = handleLogin;
