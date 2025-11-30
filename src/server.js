const express = require("express");
const app = express();

const PORT = 3001;

app.listen(MessagePort, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});