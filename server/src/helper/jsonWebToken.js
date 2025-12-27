const jwt = require("jsonwebtoken");
const jsonWebToken = async (payload, secretKey, expiresIn) => {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

module.exports = { jsonWebToken };
