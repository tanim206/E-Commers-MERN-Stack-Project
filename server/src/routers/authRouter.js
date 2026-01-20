const express = require("express");
const runValidation = require("../validators");
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
} = require("../controllers/auth.controller");
const { isLoggedOut, isLoggedIn } = require("../middleWare/auth");
const { validateUserLogin } = require("../validators/auth");

const authRouter = express.Router();
/// api/auth---
authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin,
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtectedRoute);
module.exports = authRouter;
