const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

exports.validate = async (req, res, next) => {
  const {babu} = req.body;
  console.log("babu bhaiya" , babu);
  console.log(req.cookies)
  const {token} = req.cookies;
  
  console.log(token, "token >>>>>>>>>>>>>>");

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "User authentication failed!",
      token: token,
    });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.VITE_JSON_WEB_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      // Attach decoded user data to request object
      req.user = decoded;
      next(); // Pass control to the next middleware/route handler
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


