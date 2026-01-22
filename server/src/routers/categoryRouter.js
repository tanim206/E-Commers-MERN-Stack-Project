const express = require("express");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleWare/auth");
const {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory
} = require("../controllers/category.controller");
const { validateCategory } = require("../validators/categoryValidator");
const categoryRouter = express.Router();
// All common router path -- /api/categories

// Create Category
categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCategory,
);
// Get Categories
categoryRouter.get("/", handleGetCategories);
// Get Category
categoryRouter.get("/:slug", handleGetCategory);
// Update Category
categoryRouter.put(
  "/:slug",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleUpdateCategory,
);
// Delete Category
categoryRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  handleDeleteCategory,
);

module.exports = categoryRouter;
