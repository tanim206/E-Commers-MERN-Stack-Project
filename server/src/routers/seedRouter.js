const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seed.controller");
const upload = require("../middleWare/uploadFile");
const seedRouter = express.Router();
//api/seed/users
seedRouter.get("/users", upload.single("image"), seedUser);
//api/seed/products
seedRouter.get("/products", upload.single("image"), seedProducts);
module.exports = seedRouter;
