const data = require("../data");
const User = require("../models/userModels");

const seedUser = async (req, res) => {
  try {
    // Delete All User
    await User.deleteMany({});
    // Create a New User
    const users = await User.insertMany(data.users);
    // Successfull Message
    return res.status(201).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = seedUser;
