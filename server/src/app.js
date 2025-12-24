const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createErrors = require("http-errors");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/res.controller");
const app = express();
// const xssClean = require("xss-clean");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minite
  max: 5,
  message: "Too Many Request From This IP. Please Try Again",
});
// app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// **** api Router
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

app.get("/test", rateLimiter, (req, res) => {
  res.status(200).send({
    statusCode: "200",
    message: "ok",
  });
});

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
