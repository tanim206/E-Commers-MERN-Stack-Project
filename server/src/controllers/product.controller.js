const createErrors = require("http-errors");
const { successResponse } = require("./res.controller");
const slugify = require("slugify");
const Product = require("../models/productModels");
const { createProduct } = require("../services/productService");

// User Process-Register
const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;
    const image = req.file;
    if (!image) {
      throw createErrors(400, "Image file is require");
    }
    if (image && image.size > 1024 * 1024 * 5) {
      throw createErrors(400, "file to large . It must be less then 5 MB");
    }
    const imageBufferString = image.buffer.toString("base64");
    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      category,
      imageBufferString,
    };
    const product = await createProduct(productData);
    return successResponse(res, {
      statusCode: 200,
      message: "Product created successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
};
