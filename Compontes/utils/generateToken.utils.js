const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const generateToken = async (payload) => {
  const option = { expiresIn: "1d" };
  return await jwt.sign(payload, process.env.VITE_JSON_WEB_TOKEN, option);
};
module.exports = { generateToken };
