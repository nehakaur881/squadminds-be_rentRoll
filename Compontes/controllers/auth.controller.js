const pool = require("../config/db.config.js");
const crypto = require("crypto");
const emailService = require("../utils/email.utils.js");
const path = require("path");
const fs = require("fs");
const { bcrypt, bcryptCompare } = require("../utils/bcrypt.utils.js");
const { generateToken } = require("../utils/generateToken.utils.js");
const { bcrypt1 } = require("bcrypt");
const { METHODS, get} = require("http");

exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const avatar = req.file;
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

    // const newid = newUser.rows[0].id;

    // if (avatar) {
    //   imageUrl = `/uploads/${avatar.filename}`;
    //   const imageQuery = "UPDATE users SET images = $1 WHERE id = $2";
    //   await pool.query(imageQuery, [imageUrl, newid]);
    // }
    return res.status(200).json({
      data: newUser.rows[0].id,
      mesage: "user registered successfullly",
    });
  } catch (error) {
    console.error("Error during registration", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getregisterUser = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json({ message: "user not found" });
  }
  try {
    const query = `SELECT id , firstname , lastname , email ,images FROM users WHERE logintoken = $1`;
    const result = await pool.query(query, [token]);

    return res
      .status(200)
      .json({ data: result.rows, message: "Data send Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(409).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    

    const passwordMatch = bcryptCompare(password, user.password);

    if (passwordMatch) {
      const loginToken = process.env.VITE_JSON_WEB_TOKEN;
      const token = await bcrypt(loginToken);
      const query = `UPDATE users SET logintoken = $1 WHERE email = $2`;
      await pool.query(query, [token, email]);

      res.cookie("token", token, {
        METHODS: get,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        success: true,
        status: 200,
        message: "User logged in successfully.",
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } else {
      res.status(409).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      return res.status(409).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await pool.query(
      "UPDATE users SET resetToken = $1, resetToken_expiry = NOW() + INTERVAL '24 hour' WHERE email = $2",
      [resetToken, email]
    );

    const resetUrl = `http://localhost:3000/api/resetPassword/${resetToken}`;
    await emailService.sendResetEmail(email, resetUrl);

    res.status(200).json({ message: "Reset password link sent successfully" });
  } catch (error) {
    console.error("Error during password reset", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;
  const hasPassword = await bcrypt(newPassword, 10);
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE resetToken = $1 AND resetToken_expiry > NOW()",
      [token]
    );
    if (user.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Invalid or expired reset token" });
    }

    await pool.query(
      "UPDATE users SET password = $1, resetToken = NULL, resetToken_expiry = NULL WHERE resetToken = $2",
      [hasPassword, token]
    );

    res.status(200).json({ message: "Password updated successfully" });
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
    res.clearCookie("token");
    return res.status(200).json("Logout successfully");
  } catch (error) {
    console.error("Error logging out ", error);
    return res.status(400).json("somthing went wrong during logout");
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldpassword, newPassword } = req.body;

  try {
    const query = `SELECT password FROM users WHERE id = $1 `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const mainPassword = result.rows[0];

    const decryptPassword = await bcryptCompare(
      oldpassword,
      mainPassword.password
    );

    if (!decryptPassword) {
      return res.status(409).json({ message: " old Password is diffrent" });
    }

    const hasnewPassword = await bcrypt(newPassword);

    const updatequery = `UPDATE users SET password = $1 WHERE id=$2`;
    await pool.query(updatequery, [hasnewPassword, id]);
    return res.status(200).json({ messaage: " Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email } = req.body;
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

    const query = `UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4`;
    await pool.query(query, [firstname, lastname, email, id]);

    // Handle avatar update if file is uploaded
    let imageUrl;
    if (avatar) {
       imageUrl = `/api/uploads/${avatar.filename}`;
      const imageQuery = "UPDATE users SET images = $1 WHERE id = $2";
      await pool.query(imageQuery, [imageUrl, id]);
    }

    return res.status(200).json({
      imageurl: imageUrl,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
