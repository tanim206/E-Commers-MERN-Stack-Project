const express = require("express");
const {
  handleGetUsers,
  handleFindSingleUserById,
  handleDeleteUserById,
  handleProcessRegister,
  handleActivateUserAccount,
  handleManageUserStatusById,
  handleUpdateUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/user.controller");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const upload = require("../middleWare/uploadFile");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleWare/auth");
const userRouter = express.Router();
// All common router path -- /api/users
userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  handleProcessRegister,
);
userRouter.post("/activate", isLoggedOut, handleActivateUserAccount); // verify Router
userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers); // Show all Users
userRouter.get("/:id", isLoggedIn, handleFindSingleUserById); // Find Single User
userRouter.delete("/:id", isLoggedIn, handleDeleteUserById); // DELETE User
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  handleResetPassword,
);
userRouter.put(
  "/:id",
  upload.single("image"),
  isLoggedIn,
  handleUpdateUserById,
); // update User
userRouter.put(
  "/manage-user/:id",
  isLoggedIn,
  isAdmin,
  handleManageUserStatusById,
);
userRouter.put(
  "/update-password/:id",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handleUpdatePassword,
);
userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword,
);

module.exports = userRouter;
