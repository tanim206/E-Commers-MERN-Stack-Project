const { body } = require("express-validator");
const validateUserRegistration = [
  // name input
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your name")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at least 3-31 charecters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 charecters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Give me your address")
    .isLength({ min: 3 })
    .withMessage("address should be at least 3 charecters long"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required. Enter your phone number"),
  body("image").optional(),
];
const validateUserLogin = [
  // Email input

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 charecters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];
const validateUserPasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("old Password is required. Enter your old Password")
    .isLength({ min: 6 })
    .withMessage(" old password should be at least 6 charecters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your new Password")
    .isLength({ min: 6 })
    .withMessage("New password should be at least 6 charecters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("confirmedPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("password did not match");
    }
    return true;
  }),
];
const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email")
    .isEmail()
    .withMessage("Invalid email address"),
];

// Registration Validetors

// Sign in Validetors

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
};
