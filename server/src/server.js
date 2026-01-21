const app = require("./app");
const connectDatabase = require("./config/db");
const logger = require("./controllers/logger.controller");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  logger.log(
    "info",
    `🚀 Server is Running at 🔗 http://localhost:${serverPort}`,
  );
  await connectDatabase();
});
