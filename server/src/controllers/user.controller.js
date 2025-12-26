const createErrors = require("http-errors");
const fs = require("fs").promises;
const User = require("../models/userModels");
const { successResponse } = require("./res.controller");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");

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
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createErrors(
        409,
        "user with this email already existed. please sign in"
      );
    }

    const newUser = { name, email, password, phone, address };
    return successResponse(res, {
      statusCode: 200,
      message: "User was created successfully",
      payload: { newUser },
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
};
