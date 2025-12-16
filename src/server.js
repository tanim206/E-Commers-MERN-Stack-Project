const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3001;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const isLoggedIn = (req, res, next) => {
  const login = true;
  if (login) {
    req.body.id = 101;
    next();
  } else {
    return res.status(401).json({
      message: "please Login first",
    });
  }
};

app.get("/", (req, res) => {
  res.status(200).send({
    statusCode: "200",
    message: "Hello World",
  });
});
app.get("/api/users", isLoggedIn, (req, res) => {
  console.log(req.body.id);
  res.status(200).send({
    statusCode: "200",
    message: "User profile create",
  });
});
// client Error
app.use((req, res, next) => {
  res.status(404).json({ message: "route not found" });
  next();
});
// server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something Broke" });
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
