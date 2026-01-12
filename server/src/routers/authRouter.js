const express = require("express");

const runValidation = require("../validators");
const { handleLogin, handleLogout } = require("../controllers/auth.controller");
const { isLoggedOut, isLoggedIn } = require("../middleWare/auth");
const { validateUserLogin } = require("../validators/auth");

const authRouter = express.Router();
/// api/auth---
authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);

module.exports = authRouter;
