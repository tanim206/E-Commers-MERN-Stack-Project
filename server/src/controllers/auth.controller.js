const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { jsonWebToken } = require("../helper/jsonWebToken");

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
