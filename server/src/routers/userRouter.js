const express = require("express");
const {
  getUsers,
  findSingleUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
} = require("../controllers/user.controller");
// const upload = require("../middleWare/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const uploadUserImage = require("../middleWare/uploadFile");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleWare/auth");

const userRouter = express.Router();

// All common router path -- /api/users
userRouter.post(
  "/process-register",
  uploadUserImage.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers); // Show all Users
userRouter.get("/:id", isLoggedIn, findSingleUserById); // Find Single User
userRouter.delete("/:id", isLoggedIn, deleteUserById); // DELETE User
userRouter.put(
  "/:id",
  uploadUserImage.single("image"),
  isLoggedIn,
  updateUserById
); // update User
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById); // update User
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnbanUserById); // update User

module.exports = userRouter;
