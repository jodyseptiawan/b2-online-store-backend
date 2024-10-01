const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

const generateToken = (payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });

  return token;
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, secretKey);

  return decoded;
};

module.exports = { generateToken, verifyToken };
