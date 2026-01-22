const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const createErrors = require("http-errors");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/res.controller");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const app = express();
// const xssClean = require("xss-clean");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minite
  max: 15,
  message: "Too Many Request From This IP. Please Try Again",
});

// app.use(xssClean());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// **** api Router
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

// client Error
app.use((req, res, next) => {
  next(createErrors(404, "route not found"));
});
// server Error ----- Sob error aikane asbe
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
