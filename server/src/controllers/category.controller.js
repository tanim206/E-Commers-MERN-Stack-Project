const slugify = require("slugify");
const createError = require("http-errors");
const { successResponse } = require("./res.controller");
const Category = require("../models/categoryModels");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require("../services/categoryService");
// Create Category
const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await createCategory(name);
    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
    });
  } catch (error) {
    next(error);
  }
};
// Get Categories
const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return successResponse(res, {
      statusCode: 200,
      message: "Category Fatched/get successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};
// Get Single Category
const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategory(slug);
    if (!category) {
      throw createError(404, "Category Not Found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category Fatched/get successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};
// Update Category
const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const updatedCategory = await updateCategory(name, slug);
    if (!updatedCategory) {
      throw createError(404, "Category Not Update with this slug");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category Updated successfully",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
};
