const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// dbEntry  for admin

exports.admin = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      messege: "All field are required....",
    });
  }

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: "User Already Registered Please Login.....",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const query =
      "INSERT INTO users (firstname, lastname, email, password  ) VALUES ($1,$2,$3,$4) RETURNING *";
    const value = [firstname, lastname, email, hashPassword];

    const result = await pool.query(query, value);
    // console.log(result, ">>>>>>>>>>>>>>>>>>>")

    return res.status(200).json({
      success: true,
      messege: "Admin created Successfully... ",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      messege: "Please try again...?",
    });
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const data = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log("start>>>>", data, "dattttttttttt");

    if (data.rows.length === 0) {
      return res.status(402).json({
        success: false,
        message: "User not registered. Please sign up.",
      });
    }

    const user = data.rows[0];

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(403).json({
        success: false,
        message: "Password incorrect.",
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: {
        id: user.id,
        email: user.email,
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

// forgotPassword
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email", email);

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log(email, ">>>>>");

    const token = crypto.randomBytes(20).toString("hex");
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 1000);

    await pool.query(
      "UPDATE users SET token = $1, tokenexpire = $2 WHERE email = $3",
      [token, tokenExpiry, email]
    );

    const resetLink = `${process.env.API_URL}/api/reset-password?token=${token}`;

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // email
    let info = await transporter.sendMail({
      from: `SquadMinds - by Kamlesh Gupta`,
      to: email,
      subject: "Forgot Password Link",
      html: `<h1>Reset Password Link</h1> <p>Please click on link</p> <a href="${resetLink}">Reset Password</a>`,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset mail sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
};

// resetPassword
exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.query.token;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "all field are required.",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE token = $1", [
      token,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "token expire",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1, token = NULL WHERE token = $2",
      [hashedPassword, token]
    );

    return res.status(200).json({
      success: true,
      message: "Password  reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password not reset please try again...",
    });
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

exports.roomData = async (req, res) => {
  const propertyId = req.params.propertyid;

  if (!propertyId) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  const {
    room_no,
    room_type,
    room_size_sqm,
    room_size_jou,
    bed,
    rent_history,
    sort_term_daily_rent,
    utility_history,
  } = req.body;

  try {
    const query =
      "INSERT INTO room (room_no ,room_type ,room_size_sqm, room_size_jou , bed , rent_history ,sort_term_daily_rent , utility_history , property_id) VALUES($1 , $2 , $3 , $4, $5 , $6 , $7 , $8 , $9)";

    await pool.query(query, [
      room_no,
      room_type,
      room_size_sqm,
      room_size_jou,
      bed,
      rent_history,
      sort_term_daily_rent,
      utility_history,
      propertyId,
    ]);

    return res.status(200).json("data send successfully");
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

exports.getRoomData = async (req, res) => {
  const query = `SELECT * FROM room`;
  try {
    const rentRoomData = await pool.query(query);

    res.status(200).json({
      success: true,
      data: rentRoomData.rows,
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching room data:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching room data",
    });
  }
};
