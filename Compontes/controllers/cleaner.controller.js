const pool = require("../config/db.config");

exports.cleaningdata = async (req, res) => {
  const { reserveroom_id } = req.params;
  if (!reserveroom_id) {
    return res.status(404).json({
      message: "room id not found",
    });
  }
  try {
    const {
      cleaning_date,
      apartment,
      cleaner,
      additional_cost,
      todo,
      check_out_times,
      notes,
      check_in_times,
      move_out_dates,
      guest,
      name,
      email,
      origin,
    } = req.body;

    const query = `INSERT INTO cleaning(cleaning_date , apartment , cleaner , additional_cost , todo , check_out_times , notes , check_in_times , move_out_dates ,guest , name , email , origin , reserveroom_id) VALUES($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 ) returning * `;
    const result = await pool.query(query, [
      cleaning_date,
      apartment,
      cleaner,
      additional_cost,
      todo,
      check_out_times,
      notes,
      check_in_times,
      move_out_dates,
      guest,
      name,
      email,
      origin,
      reserveroom_id,
    ]);

    console.log(result.rows, "result rows");
    return res.status(200).json({
      message: "cleaning data send successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server Error ! ",
    });
  }
};

exports.getCleaningdata = async (req, res) => {
    try {
      const query = `
        SELECT 
          r.reserveroom_id, r.name, r.email, r.departure_date, r.guest, 
          r.notes, r.booking_source, r.cleaning, r.currency, r.amount, 
          r.check_in_time, r.check_out_time, c.cleaning_id, c.additional_cost, c.todo
        FROM 
          reservationroom r
        LEFT JOIN 
          cleaning c ON r.reserveroom_id = c.reserveroom_id
        WHERE 
          r.departure_date > CURRENT_DATE
      `;
      
      const result = await pool.query(query);
      
      return res.status(200).json({
        data: result.rows,
        message: "Data fetched successfully!",
      });
    } catch (error) {
      console.log(error, "error");
      return res.status(500).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  };
  