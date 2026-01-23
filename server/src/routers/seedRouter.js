const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seed.controller");
const { uploadUserImage, uploadProductImage } = require("../middleWare/uploadFile");
// const upload = require("../middleWare/uploadFile");
const seedRouter = express.Router();
//api/seed/users
seedRouter.get("/users", uploadUserImage.single("image"), seedUser);
//api/seed/products
seedRouter.get("/products", uploadProductImage.single("image"), seedProducts);
module.exports = seedRouter;
