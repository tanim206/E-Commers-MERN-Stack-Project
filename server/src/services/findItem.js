const createErrors = require("http-errors");
const mongoose = require("mongoose");

const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createErrors(404, `${Model.modelName} does not match with this ID`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createErrors(400, "Invalid Item Id");
    }
    throw error;
  }
};

module.exports = { findWithId };
