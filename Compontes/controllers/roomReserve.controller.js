const pool = require("../config/db.config");

exports.roomReservation = async (req, res) => {
  const { property_id, room_id } = req.params;
  const {
    name,
    email,
    phone,
    guest,
    notes,
    booking_source,
    cleaning,
    currency,
    amount,
    arrived_date,
    check_in_time,
    check_out_time,
    departure_date,
  } = req.body;
  // if (!property_id || !room_id) {
  //   return res.status(404).json({
  //     message: "Propertyid or roomid not found!",
  //   });
  // }

  try {
    const query1 =
      "INSERT INTO  reservationroom (name , email , phone , guest , notes , booking_source , cleaning , currency , amount , arrived_date ,  check_in_time, check_out_time , departure_date , property_id , room_id ) VALUES($1 , $2 , $3, $4, $5, $6, $7, $8 , $9 ,$10 , $11 , $12 , $13 , $14 , $15)";

     await pool.query(query1, [
      name,
      email,
      phone,
      guest,
      notes,
      booking_source,
      cleaning,
      currency,
      amount,
      arrived_date,
      check_in_time,
      check_out_time,
      departure_date,
      property_id,
      room_id
    ]);

    return res
      .status(200)
      .json({ message: "room reservation data send successfully !" });
  } catch (error) {
    console.log(error, "error>????");
    return res.status(500).json({
      resonse: error,
      message: "Internal Server Error",
    });
  }
};
