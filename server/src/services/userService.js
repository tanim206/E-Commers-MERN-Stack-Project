const createErrors = require("http-errors");
const User = require("../models/userModels");
const deleteImage = require("../helper/deleteImageHelper");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jsonWebToken } = require("../helper/jsonWebToken");
const { jwtResetPasswordKey, clientURL } = require("../secret");
const sendEmail = require("../helper/sendEmail");

const findUsers = async (search, limit, page) => {
  try {
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
    if (!users || users.length === 0) {
      throw createErrors(404, "User not found");
    }
    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        priviousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};
const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);
    if (!user) {
      throw createErrors(404, "User not found");
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createErrors(400, "Invalid Id");
    }
    throw error;
  }
};
const deleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    if (user && user.image) {
      await deleteImage(user.image);
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createErrors(400, "Invalid Id");
    }
    throw error;
  }
};
const updateUserById = async (userId, req) => {
  try {
    const options = { password: 0 };
    const user = await findUserById(userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};
    const allowedFields = ["name", "password", "phone", "address"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createErrors(400, "Email can not be updated");
      }
    }

    const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 4) {
        throw createErrors(400, "file to large . It must be less then 2 MB");
      }
      // updates.image = image;
      user.image = image.buffer.toString("base64");
    }

    // delete updates.email;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions,
    ).select("-password");

    if (updatedUser) {
      throw createErrors(404, "User with this ID does not exist");
    }
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createErrors(400, "Invalid Id");
    }
    throw error;
  }
};
const updateUserPasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmPassword,
) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createErrors(404, "User is not found with this email");
    }
    if (newPassword !== confirmPassword) {
      throw createErrors(400, "New Password & Confirm Password Didn't Match");
    }

    const ispasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!ispasswordMatch) {
      throw createErrors(401, "oldPassword is not correct");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions,
    ).select("-password");

    if (!updatedUser) {
      throw createErrors(400, "User was not updated successfully");
    }
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createErrors(400, "Invalid Id");
    }
    throw error;
  }
};
const forgetPasswordByEmail = async (email) => {
  try {
    const userData = await User.findOne({ enail: email });
    if (!userData) {
      throw createErrors(
        404,
        "Email is incorrect or you have not verify your email address. Please Register your first",
      );
    }
    // create jwt
    const token = jsonWebToken({ email }, jwtResetPasswordKey, "10min");
    // prepare email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `<h1>Hello ${userData.name}! </h1>
      <p>Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">reset your password</a> </p>`,
    };
    // send email with nodemailer
    sendEmail(emailData);
    return token;
  } catch (error) {
    throw error;
  }
};
const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPasswordKey);
    if (!decoded) {
      throw createErrors(400, "Invalid or Expired Token");
    }
    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options,
    ).select("-password");
    if (!updatedUser) {
      throw createErrors(400, "Passoword Reset Failed");
    }
  } catch (error) {
    throw error;
  }
};
const handleUserAction = async (userId, action) => {
  try {
    let update;
    let successMessage;

    if (action === "ban") {
      update = { isBanned: true };
      successMessage = "User was banned successfully";
    } else if (action === "unban") {
      update = { isBanned: false };
      successMessage = "User was unbanned successfully";
    } else {
      throw createErrors(400, 'Invalid action. Use "ban" or "unban"');
    }

    const updateOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions,
    ).select("-password");

    if (!updateUser) {
      throw createErrors(400, "User update failed");
    }

    return successMessage;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createErrors(400, "Invalid Id");
    }
    throw error;
  }
};

module.exports = {
  findUsers,
  findUserById,
  deleteUserById,
  updateUserById,
  updateUserPasswordById,
  forgetPasswordByEmail,
  resetPassword,
  handleUserAction,
};
