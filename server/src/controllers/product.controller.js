const createErrors = require("http-errors");
const { successResponse } = require("./res.controller");
const slugify = require("slugify");
const Product = require("../models/productModels");
const { createProduct } = require("../services/productService");

const handleCreateProduct = async (req, res, next) => {
  try {
    const image = req.file?.path;

    const product = await createProduct(req.body, image);
    return successResponse(res, {
      statusCode: 200,
      message: "Product created successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};
const handleGetProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const products = await Product.find({})
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    if (!products) throw createErrors(404, "No Products Found");
    const countProducts = await Product.find({}).countDocuments();
    return successResponse(res, {
      statusCode: 200,
      message: "Products Returned successfully",
      payload: {
        products: products,
        pagination: {
          current_Page: page,
          previous_Page: page - 1,
          next_Page: page + 1,
          total_page: Math.ceil(countProducts / limit),
          total_Number_Off_Product: countProducts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
};
