const data = require("../data");
const Product = require("../models/productModels");
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
const seedProducts = async (req, res) => {
  try {
    // Delete All User
    await Product.deleteMany({});
    // Create a New User
    const products = await Product.insertMany(data.products);
    // Successfull Message
    return res.status(201).json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser, seedProducts };
