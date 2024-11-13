const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

exports.validate = async (req, res, next) => {
  const {token} = req.cookies;
  
  if (!token) {
    return res.status(401).json({
      message: "User authentication failed!",
      token: token,
    });
  }

  try {
    jwt.verify(token, process.env.VITE_JSON_WEB_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next(); 
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
