const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { jsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const deleteImage = require("../helper/deleteImageHelper");
const {
  handleUserAction,
  findUsers,
  findUserById,
  updateUserById,
  updateUserPasswordById,
  forgetPasswordByEmail,
  resetPassword,
} = require("../services/userService");
const checkUserExists = require("../helper/checkUserExists");
const sendEmail = require("../helper/sendEmail");

//  GET all user  Find
const handleGetUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const { users, pagination } = await findUsers(search, limit, page);
    return successResponse(res, {
      statusCode: 200,
      message: "User were return successfully",
      payload: {
        users: users,
        pagination: pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
// GET Single User Find
const handleFindSingleUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserById(id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User were return successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
// DELETE Single User
const handleDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    await deleteUserById(id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User was delete successfully",
    });
  } catch (error) {
    next(error);
  }
};
// User Process-Register
const handleProcessRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const image = req.file?.path;

    if (image && image.size > 1024 * 1024 * 5) {
      throw createErrors(400, "file to large . It must be less then 2 MB");
    }
    // const imageBufferString = image.toString();
    // user exists
    const userExists = await checkUserExists(email);
    if (userExists) {
      throw createErrors(
        409,
        "user with this email already existed. please sign in",
      );
    }

    // JWT CREATE TOKEN
    const tokenPayload = {
      name,
      email,
      password,
      phone,
      address,
      // image: imageBufferString,
    };
    if (image) {
      tokenPayload.image = image;
    }
    const token = jsonWebToken(tokenPayload, jwtActivationKey, "10min");

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `<h1>Hello ${name}! </h1>
      <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account</a> </p>`,
    };

    // send email with nodemailer
    sendEmail(emailData);
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};
// activate User Account  VERIFY
const handleActivateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createErrors(404, "token not found");
    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createErrors(404, "user was no verify");

      ///
      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createErrors(
          409,
          "user with this email already existed. please sign in",
        );
      }

      await User.create(decoded);
      // console.log(decoded);
      return successResponse(res, {
        statusCode: 201,
        message: `user was registered successfully`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createErrors(401, "Token was Expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createErrors(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};
// Update User
const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUserById(userId, req);
    return successResponse(res, {
      statusCode: 200,
      message: " User was updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
//  Banned/Unbanned User
const handleManageUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;
    const successMessage = await handleUserAction(action, userId);
    return successResponse(res, {
      statusCode: 200,
      message: successMessage,
    });
  } catch (error) {
    next(error);
  }
};
// update password
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;
    const updatedUser = await updateUserPasswordById(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    );
    return successResponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
// forget password
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await forgetPasswordByEmail(email);
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for reset the password`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};
// reset password
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);
    return successResponse(res, {
      statusCode: 200,
      message: " Password Reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleGetUsers,
  handleFindSingleUserById,
  handleDeleteUserById,
  handleProcessRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleManageUserStatusById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
