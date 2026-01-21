const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/logger.controller");

const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    logger.log("info", "✅ Database Connect Successfull");
    mongoose.connection.on("error", () => {
      logger.log("error", "❌ Database Connection Error", error);
    });
  } catch (error) {
    logger.log("error", "❌ Database Connect Failed", error.toString());
  }
};

module.exports = connectDatabase;
