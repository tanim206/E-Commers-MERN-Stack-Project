const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 3001;

app.use(morgan('dev'))
app.get("/", (req, res) => {
    res.status(200).send({
        statusCode: "200",
        message: "Hello World"
    });
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
