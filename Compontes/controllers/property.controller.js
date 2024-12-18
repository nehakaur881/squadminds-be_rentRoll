const pool = require("../config/db.config");

exports.addProperties = async (req, res) => {
  try {
    const { property_name, zip, city, ward, location, street } = req.body;
    const pdf_file = req.file; 
    let fileUrl = null;

    // Validate required fields
    if (!property_name) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please fill required fields",
      });
    }
    if (pdf_file) {
      fileUrl = `${process.env.BACKEND_URL}/uploads/${pdf_file.filename}`;
      console.log("Uploaded file URL:", fileUrl);
    }

    const query = `
      INSERT INTO properties (property_name, zip, city, ward, location, street, pdf_file)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const values = [property_name, zip, city, ward, location, street, fileUrl];
    const result = await pool.query(query, values);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Property added successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong.",
      error: error.message,
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
  const filesData = req.file;  
  let filesUrl = null;

  try {
    if (filesData) {
      filesUrl = `${process.env.BACKEND_URL}/uploads/${filesData.filename}`; 
         
    }
    else if (invoice) {
      filesUrl = invoice; 
    }
    const query =
      "UPDATE properties SET property_name = $1, zip = $2, city = $3, ward = $4, location = $5, street = $6 , pdf_file = $7 WHERE property_id = $8 RETURNING *";
    const values = [property_name, zip, city, ward, location, street, filesUrl , property_id];
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
  const pdfFile = req.file;  
  let pdfFileUrl = null;
  try {
    const query =
    "INSERT INTO room (room_no, room_type, room_size_sqm, room_size_jou, bed, rent_history, sort_term_daily_rent, utility_history, property_id, pdf_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";

    await pool.query(query, [
      room_no,
      room_type,
      room_size_sqm || null,
      room_size_jou || null,
      bed || null,
      rent_history || null,
      sort_term_daily_rent || null,
      utility_history || null,
      propertyId,
      pdfFileUrl || null,
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
  const query = `SELECT * 
  FROM room r
  INNER JOIN properties p ON r.property_id = p.property_id;
  `;
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
      .json({ message: "propertyid or roomid are required" });
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
  const pdfFile = req.file;  
  let pdfFileUrl = null;
  try {
    
    if (pdfFile) {
      pdfFileUrl = `${process.env.BACKEND_URL}/uploads/${pdfFile.filename}`;
      console.log("pdfFileUrl",pdfFile.filename)
    }
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
      utility_history = $8 ,
      pdf_file = $9 
    WHERE room_id = $10 AND property_id = $11
    RETURNING *`;
    const result = await pool.query(query, [
      room_no,
      room_type || null,
      room_size_sqm || null,
      room_size_jou || null,
      bed || null,
      rent_history || null,
      sort_term_daily_rent || null,
      utility_history || null, 
      pdfFileUrl || null,
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
