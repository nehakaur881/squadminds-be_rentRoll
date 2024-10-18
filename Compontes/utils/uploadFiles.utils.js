const pool = require('../config/db'); // Assuming you use a database pool

// Utility to upload image information to the database
const uploadImageToDB = async (filePath, userId) => {

  try {
    const query = "UPDATE users SET userimage = $1 WHERE id = $2 RETURNING *";
    const result = await pool.query(query, [filePath, userId]);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error uploading image to DB:", error);
    throw error;
  }
};

module.exports = uploadImageToDB;
