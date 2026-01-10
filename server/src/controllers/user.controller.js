const createErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { jsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const emailWithNodeMailer = require("../helper/email");

//  GET all user  Find
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users) throw createErrors(404, "user not found");

    return successResponse(res, {
      statusCode: 200,
      message: "User were return successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          priviousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
        },
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
    const user = await findWithId(User, id, options);
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
    const user = await findWithId(User, id, options);

    // Image controller
    const userImagePath = user.image;
    deleteImage(userImagePath);
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
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
    const image = req.file;
    if (!image) {
      throw createErrors(400, "Image file is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createErrors(400, "file to large . It must be less then 2 MB");
    }
    const imageBufferString = image.buffer.toString("base64");
    // user exists
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createErrors(
        409,
        "user with this email already existed. please sign in"
      );
    }

    // JWT CREATE TOKEN
    const token = jsonWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtActivationKey,
      "10min"
    );

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `<h1>Hello ${name}! </h1>
      <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account</a> </p>`,
    };

    // send email with nodemailer
    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createErrors(500, "Failed to verification Email"));
      return;
    }

    // console.log(token);
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// activate User Account   VERIFY
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
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw createErrors(400, "Email can not be updated");
      }
    }

    const image = req.file;
    if (image) {
      // image size maximum 2MB
      if (image.size > 1024 * 1024 * 2) {
        throw createErrors(400, "file to large . It must be less then 2 MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    // delete updates.email;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");
    if (updateUser) {
      throw createErrors(404, "User with this ID does not exist");
    }
    return successResponse(res, {
      statusCode: 200,
      message: " User was updated successfully",
      payload: updateUser,
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
  updateUserById,
};
