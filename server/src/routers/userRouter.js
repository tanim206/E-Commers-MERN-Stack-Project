const express = require("express");
const {
  getUsers,
  findSingleUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
} = require("../controllers/user.controller");
// const upload = require("../middleWare/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const uploadUserImage = require("../middleWare/uploadFile");

const userRouter = express.Router();

// All common router path -- /api/users
userRouter.post(
  "/process-register",
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/activate", activateUserAccount);
userRouter.get("/", getUsers); // Show all Users
userRouter.get("/:id", findSingleUserById); // Find Single User
userRouter.delete("/:id", deleteUserById); // DELETE User
userRouter.put("/:id", uploadUserImage.single("image"), updateUserById); // update User

module.exports = userRouter;
