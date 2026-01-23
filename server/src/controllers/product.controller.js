const createErrors = require("http-errors");
const { successResponse } = require("./res.controller");
const slugify = require("slugify");
const Product = require("../models/productModels");
const {
  createProduct,
  getProducts,
  getProduct,
} = require("../services/productService");

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
    const productData = await getProducts(page, limit);
    return successResponse(res, {
      statusCode: 200,
      message: "All Product Returned successfully",
      payload: {
        products: productData.products,
        pagination: {
          totalPages: productData.totalPages,
          previousPage: productData.currentPage - 1,
          nextPage: productData.currentPage + 1,
          currentPage: productData.currentPage,
          total_Number_Off_Product: productData.countProducts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getProduct(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Single Product Returned successfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
};
