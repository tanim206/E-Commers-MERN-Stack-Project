const express = require("express");
const {
  handleCreateProduct,
  handleGetProducts,
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
// Get/Read Product
productRouter.get("/", handleGetProducts);

module.exports = productRouter;
