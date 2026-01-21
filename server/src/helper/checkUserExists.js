const User = require("../models/userModels");

const checkUserExists = async (email) => {
  return await User.exists({ email: email });
};

module.exports = checkUserExists;
