const express = require("express");
const seedUser = require("../controllers/seed.controller");
const seedRouter = express.Router();

seedRouter.get("/users", seedUser); //     --- /api/seed/users
module.exports = seedRouter;
