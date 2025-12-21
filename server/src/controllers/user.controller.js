const createErrors = require("http-errors");

const getUser = (req, res, next) => {
  try {
    res.status(200).send({
      statusCode: "200",
      message: "User profile create",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
