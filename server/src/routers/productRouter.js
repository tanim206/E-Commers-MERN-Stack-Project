const express = require("express");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
} = require("../controllers/product.controller");
const { validateProduct } = require("../validators/productValidator");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleWare/auth");
const { uploadProductImage } = require("../middleWare/uploadFile");
const productRouter = express.Router();
// All common router path -- /api/products
// Create Product
productRouter.post(
  "/",
  uploadProductImage.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct,
);
// Get/Read Products
productRouter.get("/", handleGetProducts);
// Get/Read Single Product
productRouter.get("/:slug", handleGetProduct);

module.exports = productRouter;
