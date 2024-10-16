const pool = require("../config/db.config");

exports.monthlyreportGenerator = async (req, res, next) => {
  const { propertyid, roomid } = req.params;

  if (!propertyid || !roomid) {
    return res.status(404).json({
      message: "provide property id or roomid ",
    });
  }
  try {
    const query = ` SELECT room_id , room_no , room_type , 
        EXTRACT(MONTHS FROM created_at) as month,
        EXTRACT(YEARS FROM created_at) as year, 
        
        Sum(CAST( sort_term_daily_rent AS NUMERIC)) AS total_sort_term_rent,
        COUNT(*) AS total_transation
        FROM room
        WHERE property_id = $1 AND room_id = $2
        GROUP BY  room_id , month , year 
        ORDER BY month DESC , year DESC 
        `;
    const result = await pool.query(query, [propertyid, roomid]);
    console.log(result.rows, "????????result");
    return res.status(200).json({ message: " Data fetch SuccessFullly !" });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
