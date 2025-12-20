const express = require("express");
const getUser = require("../controllers/user.controller");
const userRouter = express.Router();

// All common router path -- /api/users
userRouter.get("/", getUser); // GET






module.exports = userRouter;
