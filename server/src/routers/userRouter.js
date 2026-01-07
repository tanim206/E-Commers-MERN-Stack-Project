const express = require("express");
const {
  getUsers,
  findSingleUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/user.controller");
const upload = require("../middleWare/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");

const userRouter = express.Router();

// All common router path -- /api/users
userRouter.post(
  "/process-register",
  validateUserRegistration,
  runValidation,
  upload.single("image"),
  processRegister
);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers); // Show all Users
userRouter.get("/:id", findSingleUserById); // Find Single User
userRouter.delete("/:id", deleteUserById); // DELETE User

module.exports = userRouter;
