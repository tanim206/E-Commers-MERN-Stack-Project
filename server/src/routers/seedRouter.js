const express = require("express");
const seedUser = require("../controllers/seed.controller");
const uploadUserImage = require("../middleWare/uploadFile");
const seedRouter = express.Router();

seedRouter.get("/users", uploadUserImage.single("image"), seedUser); //     --- /api/seed/users
module.exports = seedRouter;
 