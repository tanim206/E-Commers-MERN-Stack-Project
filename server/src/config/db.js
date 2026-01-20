const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("✅ Database Connect Successfull");
    mongoose.connection.on("error", () => {
      console.error("Database Connection Error", error);
    });
  } catch (error) {
    console.error("Database Connect Failed", error.toString());
  }
};

module.exports = connectDatabase;
