const pool = require("../config/db.config");

exports.cleaningdata = async (req, res) => {
  try {
    const { email, name, todo, maintenance, reserveroom_id,  property_id, cleaning_date } = req.body;
    const query = `INSERT INTO cleaning( email, name, todo, maintenance , reserveroom_id,  cleaning_date, property_id) VALUES($1 , $2 , $3, $4, $5, $6, $7) returning * `;
  const result =  await pool.query(query, [email, name, todo, maintenance, reserveroom_id, cleaning_date,property_id, ]);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "cleaning data send successfully",
    });
  } catch (error) {
    console.log("errrr", error)
    return res.status(500).json({
      message: "Internal server Error ! ",
    });
  }
};

exports.updateCleaningData = async (req, res) => {
  const { cleaningId } = req.params;
  if (!cleaningId) {
    return res
      .status(404)
      .json({ message: "cleaningId is required" });
  }
  const { cleaning_date, email, name, todo, maintenance } = req.body;
  try {
    const query = `UPDATE cleaning SET cleaning_date = $1, email = $2, name = $3, todo = $4, maintenance = $5 WHERE cleaning_id = $6`;
    const result = await pool.query(query, [
      cleaning_date,
      email,
      name,
      todo,
      maintenance,
      cleaningId,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cleaner not found to update" })
    }
    return res.status(200).json({
      success : true,
      status : 200,
      message: "cleaner updated successfully"
    })
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ messsage: "internal server error" });


  }
}

exports.getCleaningdata = async (req, res) => {
  try {
    const query = `
      SELECT
      p.property_name,                      
      r.room_id,
      r.property_id,                   
      r.name,                          
      r.email,                         
      r.departure_date,                
      r.guest,                         
      r.notes,                         
      r.booking_source,                
      r.currency,                      
      r.amount,                        
      r.check_in_time,                 
      r.check_out_time,                
      c.cleaning_id,                   
      c.additional_cost,               
      c.todo,                          
      c.maintenance,                   
      c.cleaning_date,                 
      c.email AS cleaner_email,        
      c.name AS cleaner_name,          
      r.reservation_id                    
     FROM 
        reservationroom r
      LEFT JOIN cleaning c 
        ON r.property_id = c.property_id
        INNER JOIN properties p 
        ON r.property_id = p.property_id;
     `;  

    const result = await pool.query(query);
    return res.status(200).json({
      data: result.rows,
      message: "Data fetched successfully!",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.getcleanerData = async (req, res) => {
  const query = `SELECT * FROM cleaning`;
  try {
    const cleaning = await pool.query(query);
    return res.status(200).json({
      success: true,
      data: cleaning.rows,
      message: "reservation room fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching room data:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching room data",
    });
  }
};

exports.deleteCleaningData = async (req , res) =>{
  const {cleaning_id} = req.params;
  
    if(!cleaning_id){
      return res.status(404).json({
        success : 'false',
        message : "id not  found"
      })
    }
  try {
    const query = `DELETE FROM cleaning where cleaning_id = $1 RETURNING *`
    const result = await pool.query(query , [cleaning_id])
    return res.status(200).json({
        success : true,
        status : 200,
        message : "Data Deleted !"
    })
    
  } catch (error) {
    console.log(error)
      return res.status(500).json({
        success : false,
        status : 500 ,
        message : "Internal Server Error !",
        error : error.message
      })
  }
}