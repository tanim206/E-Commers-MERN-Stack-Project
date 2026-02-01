const { successResponse } = require("./res.controller");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../services/productService");
const Product = require("../models/productModels");
const slugify = require("slugify");
const { deleteImage } = require("../helper/deleteImage");

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
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [{ name: { $regex: searchRegExp } }],
    };
    const productData = await getProducts(page, limit, filter);
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
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    await deleteProduct(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const updatedProduct = await updateProduct(slug, req);

    return successResponse(res, {
      statusCode: 200,
      message: "Product was updated successfully",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
