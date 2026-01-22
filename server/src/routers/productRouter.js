const express = require("express");
const upload = require("../middleWare/uploadFile");
const { handleCreateProduct } = require("../controllers/product.controller");
const { validateProduct } = require("../validators/productValidator");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleWare/auth");
const productRouter = express.Router();
// All common router path -- /api/products

productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct,
);

module.exports = productRouter;
