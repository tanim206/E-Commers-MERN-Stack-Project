const createErrors = require("http-errors");
const users = require("../models/userModels");

const getUser = (req, res, next) => {
  try {
    res.status(200).send({
      statusCode: "200",
      message: "User profile create",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
