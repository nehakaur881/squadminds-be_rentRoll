const pool = require("../config/db.config");


exports.addProperties = async (req, res) => {
  try {
    const { property_name, zip, city, ward, location, street } = req.body;

    if (!property_name || !zip || !city || !ward || !location || !street) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "please fill require fields",
      });
    }

    const query =
      "INSERT INTO properties ( property_name, zip, city, ward, location, street ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";
    const value = [property_name, zip, city, ward, location, street];
    const result = await pool.query(query, value);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Property add successfully..",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      status: 501,
      message: "somethings went wrong.....",
      message: error.message,
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const query = "SELECT * FROM properties";
    const result = await pool.query(query);
    return res.status(200).json({
      status: 200,
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(501).json({
      status: 501,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.updateProperties = async (req, res) => {
  const {  id } = req.params;
   const property_id = id;
  if (!property_id) {
    return res
      .status(404)
      .json({ message: " property_id or roomid are required" });
  }
  const { property_name, zip, city, ward, location, street } = req.body;
  try {
    const query =
      "UPDATE properties SET property_name = $1, zip = $2, city = $3, ward = $4, location = $5, street = $6 WHERE property_id = $7 RETURNING *";
    const values = [property_name, zip, city, ward, location, street, property_id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Property updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(501).json({
      status: 501,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

// DELETE PROPERTIES
exports.deleteProperties = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM properties WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(501).json({
      status: 501,
      message: "Something went wrong.",
      error: error.message,
    });
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

exports.updateRoom = async (req, res) => {
  const { propertyid , roomid} = req.params;
  
  if (!propertyid || !roomid) {
    return res
      .status(404)
      .json({ message: " propertyid or roomid are required" });
  }
  const {
    room_type,
    room_size_sqm,
    room_size_jou,
    bed,
    rent_history,
    sort_term_daily_rent,
    utility_history,
  } = req.body;
  try {
    
    
    const query = `UPDATE room SET  room_type = $1 , room_size_sqm = $2 , room_size_jou = $3 , bed = $4 , rent_history = $5 , sort_term_daily_rent  = $6 , utility_history = $7 WHERE room_id = $8 AND property_id = $9 `;
    const result = await pool.query(query, [
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
     if(result.rowCount === 0){
      return res.status(404).json({message : "room not found to update"})
     }

    return res.status(200).json({
      message : "room id updated successfully"
     })

  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ messsage: "internal server error" });
  }
};

exports.deleteRoom = async (req , res) =>{
  const {roomid} = req.params;
  if(!roomid){
    return res.status(404).json({
      message : "room id not found"
    })
  }
  try {
    const checkquery = `SELECT * FROM room WHERE room_id = $1`;
      const checkresult = await pool.query(checkquery , [roomid]);
      if(checkresult.rowCounts === 0){
        return res.status(404).json({
          message : "invalid room id or room not found"
        })
      }
    const query = `DELETE FROM  room WHERE room_id = $1`
    await pool.query(query , [roomid])
    return res.status(200).json({message : " Room table deleted successfully!"})
      
  } catch (error) {
    console.log(error.stack)
    return res.status(500).json({message : "internal server error "})
  }

}
