const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { findWithId } = require("../services/findItem");
const { jsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const deleteImage = require("../helper/deleteImageHelper");
const {
  handleUserAction,
  findUsers,
  findUserById,
  updateUserById,
} = require("../services/userService");

//  GET all user  Find
const getUsers = async (req, res, next) => {
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
const findSingleUserById = async (req, res, next) => {
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
const deleteUserById = async (req, res, next) => {
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
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const image = req.file?.path;

    if (image && image.size > 1024 * 1024 * 5) {
      throw createErrors(400, "file to large . It must be less then 2 MB");
    }
    // user exists
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createErrors(
        409,
        "user with this email already existed. please sign in"
      );
    }

    // JWT CREATE TOKEN
    const tokenPayload = {
      name,
      email,
      password,
      phone,
      address,
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
    emailWithNodeMailer(emailData);
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
const activateUserAccount = async (req, res, next) => {
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
          "user with this email already existed. please sign in"
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
    const {  oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User.userId);

    const ispasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!ispasswordMatch) {
      throw createErrors(401, "oldPassword is not correct");
    }
    const filter = { userId };
    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if(!updatedUser){
      throw createErrors(400,"User was not updated successfully")
    }
    return successResponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUsers,
  findSingleUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  handleUpdateUserById,
  handleManageUserStatusById,
  handleUpdatePassword,
};
