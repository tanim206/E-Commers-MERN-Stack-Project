const { body } = require("express-validator");
const validateUserRegistration = [
  // name input
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at least 3-31 charecters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];

// Registration Validetors

// Sign in Validetors

module.exports = { validateUserRegistration };
