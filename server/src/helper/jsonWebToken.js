const jwt = require("jsonwebtoken");
const jsonWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("payload must be a non-empty object");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("secret key  must be a non-empty string");
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (err) {
    console.error("failed to sign the jwt :", err);
    throw err;
  }
};

module.exports = { jsonWebToken };
