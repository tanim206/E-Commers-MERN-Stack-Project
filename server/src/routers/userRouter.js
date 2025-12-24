const express = require("express");
const {
  getUsers,
  findSingleUserById,
  deleteUserById,
} = require("../controllers/user.controller");

const userRouter = express.Router();

// All common router path -- /api/users
userRouter.get("/", getUsers); // GET
userRouter.get("/:id", findSingleUserById); // GET
userRouter.delete("/:id", deleteUserById); // DELETE

module.exports = userRouter;
