const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateRandomToken = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

// dbEntry  for admin

exports.admin = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "All fields are required....",
    });
  }

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: "User Already Registered. Please Login.....",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const query =
      "INSERT INTO users ( email, password) VALUES ($1, $2) RETURNING *";
    const values = [email, hashPassword];

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: "Admin created Successfully...",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Please try again...?",
    });
  }
};
// login
exports.login = async (req, res) => {
  const { email, password } = req.body;


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

    const randomToken = generateRandomToken(8);
    user.token = randomToken;
    await pool.query("UPDATE users SET token = $1 WHERE id = $2", [
      randomToken,
      user.id,
    ]);
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

// forgotPassword
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

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

    const token = crypto.randomBytes(20).toString("hex");
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 1000);

    await pool.query(
      "UPDATE users SET token = $1, tokenexpire = $2 WHERE email = $3",
      [token, tokenExpiry, email]
    );

    const resetLink = `${process.env.API_URL}/authentication/sign-in/reset/${token}`;
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

    return res.status(201).json({
      success: true,
      message: "Password reset mail sent successfully",
      status: 201,
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
  const { password } = req.body;
  const token = req.params.token;


  if (!token || !password) {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = $1, token = NULL WHERE token = $2",
      [hashedPassword, token]
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password not reset please try again...",
    });
  }
};

// add Properties data
exports.addProperties = async (req, res) => {

    try {
        const { propertyName, zip, city, ward, location, street, } = req.body;

        if (!propertyName || !zip || !city || !ward || !location || !street) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "please fill require fields"
            })
        }

        const query = 'INSERT INTO properties ( propertyName, zip, city, ward, location, street ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *'
        const value = [propertyName, zip, city, ward, location, street,  ];
        const result = await pool.query(query, value);


        return res.status(200).json({
            status: 200,
            success: true,
            message: "Property add successfully..",
            data: result.rows[0]
        })


    } catch (error) {
        console.log(error);
        return res.status(501).json({
            status: 501,
            message: "somethings went wrong.....",
            message:error.message
        })
    }
}

//  properties data get
exports.getProperties = async (req, res) => {
    try {
        const query = 'SELECT * FROM properties';
        const result = await pool.query(query);
        return res.status(200).json({
            status: 200,
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(501).json({
            status: 501,
            message: "Something went wrong.",
            error: error.message
        });
    }
};

//  logout
exports.logoutUser = async (req, res) => {
    const { token } = req.body;
    try {
      if (!token) {
        return res.status(400).json({ message: "token not found" });
      }
      const queryCheck = `SELECT * FROM users WHERE token = $1`;
      const tokencheck = await pool.query(queryCheck, [token]);
  
      if (!tokencheck) {
        return res.status(400).json({ message: "token is invalid or expire" });
      }
  
      const query = `UPDATE users Set token = NULL  WHERE token = $1`;
      await pool.query(query, [token]);
      res.clearCookie("token");
      return res.status(200).json({
          success: true,
          message: "Logout successfully",
          status: 200,
        });
    } catch (error) {
      console.error("Error logging out ", error);
      return res.status(400).json("somthing went wrong during logout");
    }
  };

  // UPDATE PROPERTIES
exports.updateProperties = async (req, res) => {
    const { id } = req.params;
    const {  propertyName, zip, city, ward, location, street } = req.body;

    try {
        const query = 'UPDATE properties SET propertyName = $1, zip = $2, city = $3, ward = $4, location = $5, street = $6 WHERE id = $7 RETURNING *';
        const values = [ propertyName, zip, city, ward, location, street, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Property updated successfully.",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(501).json({
            status: 501,
            message: "Something went wrong.",
            error: error.message
        });
    }
};

// DELETE PROPERTIES
exports.deleteProperties = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM properties WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Property deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(501).json({
            status: 501,
            message: "Something went wrong.",
            error: error.message
        });
    }
};

// Room Add
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
      propertyId
    ]);

    return res.status(200).json("data send successfully");
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      message: "internal server error",
    });
  }
}; 
// get room data
exports.getRoomData = async (req, res) => {
  const query = `SELECT * FROM room`;
  try {
    const rentRoomData = await pool.query(query);

    res.status(200).json({
      success: true,
      data: rentRoomData.rows,
      message: "Rooms fetched successfully",
      status:200,
    });
  } catch (error) {
    console.error("Error fetching room data:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching room data",
    });
  }
};

// updated room data

exports.updateRoom = async (req, res) => {
  const { propertyid, roomid } = req.params;

  if (!propertyid || !roomid) {
    return res.status(404).json({ message: "propertyid or roomid are required" });
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
    const query = `
      UPDATE room 
      SET 
        room_no = $1, 
        room_type = $2, 
        room_size_sqm = $3, 
        room_size_jou = $4, 
        bed = $5, 
        rent_history = $6, 
        sort_term_daily_rent = $7, 
        utility_history = $8 
      WHERE id = $9 AND property_id = $10 
      RETURNING *`;
      
    const result = await pool.query(query, [
      room_no,
      room_type,
      room_size_sqm,
      room_size_jou,
      bed,
      rent_history,
      sort_term_daily_rent,
      utility_history,
      roomid,
      propertyid,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "room not found to update" });
    }

    return res.status(200).json({
      message: "room updated successfully",
      status: 200,
      data: result.rows[0],
    });

  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ message: "internal server error" });
  }
};

// delete room
exports.deleteRoom = async (req , res) =>{
  const {id} = req.params;
  if(!id){
    return res.status(404).json({
      message : "room id not found"
    })
  }
  try {
    const checkquery = `SELECT * FROM room WHERE id = $1`;
      const checkresult = await pool.query(checkquery , [id]);
      if(checkresult.rowCounts === 0){
        return res.status(404).json({
          message : "invalid room id or room not found"
        })
      }
    const query = `DELETE FROM  room WHERE id = $1`
    await pool.query(query , [id])
    return res.status(200).json({message : " Room table deleted successfully!", status: 200,
    success: true,
    })
      
  } catch (error) {
    console.log(error.stack)
    return res.status(500).json({message : "internal server error "})
  }
}