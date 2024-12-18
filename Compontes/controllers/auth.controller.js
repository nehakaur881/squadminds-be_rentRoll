const pool = require("../config/db.config.js");
const crypto = require("crypto");
const emailService = require("../utils/email.utils.js");
const path = require("path");
const fs = require("fs");
const { bcryptCompare, bcrypt } = require("../utils/bcrypt.utils.js");

const generateRandomToken = (length) => crypto.randomBytes(length).toString("hex").slice(0, length);

exports.registerUser = async (req, res) => {
  let { firstname, lastname, email, password } = req.body;
  email =  email.trim().toLowerCase();
  password = password.trim();       
  // const avatar = req.file;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rowCount > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt(password, 10);

    const userQuery =
      "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id";
    const newUser = await pool.query(userQuery, [
      firstname,
      lastname,
      email,
      hashedPassword,
    ]);

    return res.status(200).json({
      status : 200,
      data: newUser.rows[0].id,
      mesage: "user registered successfullly",
    });
  } catch (error) {
    console.error("Error during registration", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getregisterUser = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "user not found" });
  }
  try {
    const query = `SELECT id , firstname , lastname , email , images FROM users WHERE logintoken = $1`;
    const result = await pool.query(query, [token]);

    return res
      .status(200)
      .json({ data: result.rows, message: "Data send Successfully" , status:200 , success : true });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "internal server error" });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const data = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (data.rows.length === 0) {
      return res.status(402).json({
        success: false,
        message: "User not registered. Please sign up.",
      });
    }

    const user = data.rows[0];

    const matchPassword = await bcryptCompare(password, user.password);

    if (!matchPassword) {
      return res.status(404).json({
        success: false,
        message: "invalid Credential.",
      });
    }

    const randomToken = generateRandomToken(38);

    try {
      await pool.query("UPDATE users SET logintoken = $1 WHERE id = $2", [randomToken, user.id]);
    } catch (dbError) {
      console.log("Database update error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database update failed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      status: 200,
      user: {
        id: user.id,
        email: user.email,
        token: randomToken,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Please try again.",
    });
  }
};
exports.forgotPassword = async (req, res) => {
  let { email } = req.body;
  email = email.trim().toLowerCase();
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await pool.query(
      "UPDATE users SET resetToken = $1, resetToken_expiry = NOW() + INTERVAL '24 hour' WHERE email = $2",
      [resetToken, email]
    );

    const resetUrl = `${process.env.REACT_APP_API_URL}/authentication/sign-in/reset/${resetToken}`;
    await emailService.sendResetEmail(email, resetUrl);

    res.status(200).json({ message: "Reset password link sent successfully" });
  } catch (error) {
    console.error("Error during password reset", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  const { confirmpassword} = req.body;
  const hasPassword = await bcrypt(confirmpassword, 10);
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE resetToken = $1 AND resetToken_expiry > NOW()",
      [token]
    );
    if (user.rowCount === 0) {
      return res.status(404).json({
          
          message: "Invalid or expired reset token" });
    }

    await pool.query(
      "UPDATE users SET password = $1, resetToken = NULL, resetToken_expiry = NULL WHERE resetToken = $2",
      [hasPassword, token]
    );

    res.status(200).json({ 
      status : 200,
      success : true ,
      message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.logoutUser = async (req, res) => {
  const { token } = req.body;
  
  try {
    if (!token) {
      return res.status(400).json({ message: "token not found" });
    }
    const queryCheck = `SELECT * FROM users WHERE logintoken = $1`;
    const tokencheck = await pool.query(queryCheck, [token]);

    if (!tokencheck) {
      return res.status(400).json({ message: "token is invalid or expire" });
    }

    const query = `UPDATE users Set logintoken = NULL  WHERE logintoken = $1`;
    await pool.query(query, [token]);
    return res.status(200).json({
      status : 200,
      message : "Logout successfully"});
  } catch (error) {
    console.error("Error logging out ", error);
    return res.status(400).json("somthing went wrong during logout");
  }
};
exports.changePassword = async (req, res) => {

  const { oldpassword, newPassword, id } = req.body;

  try {
    const query = `SELECT password FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const mainPassword = result.rows[0].password;

    const decryptPassword = await bcryptCompare(oldpassword, mainPassword);

    if (!decryptPassword) {
      return res.status(409).json({ message: "Old password is different" });
    }

    const hashedNewPassword = await bcrypt(newPassword);

    const updateQuery = `UPDATE users SET password = $1 WHERE id = $2`;
    await pool.query(updateQuery, [hashedNewPassword, id]);

    return res
      .status(200)
      .json({ message: "Password updated successfully", status: 200, success: true, });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, contact } = req.body;
  
  const avatar = req.file;
  if (!id) {
    return res.status(400).json({ message: "User not found" });
  }
  try {
    const validate = `SELECT id FROM users WHERE id = $1`;
    const validateCheck = await pool.query(validate, [id]);
    if (validateCheck.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = `UPDATE users SET firstname = $1, lastname = $2, email = $3, contact = $4 WHERE id = $5`;
    const data = await pool.query(query, [
      firstname,
      lastname,
      email,
      contact || null,
      id,
    ]);
    let imageUrl;
    if (avatar) {
      imageUrl = `${process.env.BACKEND_URL}/uploads/${avatar.filename}`;
      const imageQuery = "UPDATE users SET images = $1 WHERE id = $2";
      await pool.query(imageQuery, [imageUrl, id]);
    }
    return res.status(200).json({
      imageUrl: imageUrl,
      message: "Profile updated successfully",
      status: 200,
      data: data,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};