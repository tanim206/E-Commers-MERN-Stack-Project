const createErrors = require("http-errors");
const User = require("../models/userModels");
const deleteImage = require("../helper/deleteImageHelper");

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
    if (!users) {
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
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createErrors(400, "User update failed");
    }

    return successMessage;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUsers,
  findUserById,
  deleteUserById,
  handleUserAction,
};
