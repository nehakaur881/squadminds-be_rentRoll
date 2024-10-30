const pool = require("../config/db.config");

exports.expenseList = (req, res) => {
  const { token } = req.cookies;
     if(!token){
        return res.status(404).json({
            message : " user not verified"
        })
     }
  try {
    return res.status(200).json({
      message: "i am good boy",
    });
  } catch (error) {
    return res.status(500).json({
      message: " Internal Server Error",
    });
  }
};
