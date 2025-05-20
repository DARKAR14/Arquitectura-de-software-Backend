const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config");

const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
