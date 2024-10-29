const pool = require("../config/db.config");

exports.cleaningdata = async (req, res) => {
  const { reserveroom_id } = req.params;
  if (!reserveroom_id) {
    return res.status(404).json({
      message: "room id not found",
    });
  }
  try {
    const { additional_cost, todo } = req.body;
    const query = `INSERT INTO cleaning( additional_cost , todo , reserveroom_id ) VALUES($1 , $2 , $3) returning * `;
    await pool.query(query, [additional_cost, todo, reserveroom_id]);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "cleaning data send successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error ! ",
    });
  }
};

exports.getCleaningdata = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(409).json({
      message: "User not Valid !",
    });
  }
  try {
    const query = `
        SELECT
          p.property_name , rm.room_no , r.reserveroom_id, r.name,  r.email, r.departure_date, r.guest, 
          r.notes, r.booking_source, r.cleaning, r.currency, r.amount,  
          r.check_in_time, r.check_out_time, c.cleaning_id, c.additional_cost, c.todo
        FROM 
          reservationroom r
        LEFT JOIN 
          cleaning c ON r.reserveroom_id = c.reserveroom_id
        LEFT JOIN 
          room rm ON r.room_id = rm.room_id
        LEFT JOIN 
          properties p ON rm.property_id = p.property_id
        WHERE 
          r.departure_date > CURRENT_DATE
      `;

    const result = await pool.query(query);

    return res.status(200).json({
      data: result.rows,
      success: true,
      message: "Data fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
