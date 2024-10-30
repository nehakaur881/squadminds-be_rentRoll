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
  if (!property_id || !room_id) {
    return res.status(404).json({
      message: "Propertyid or roomid not found!",
    });
  }

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
      room_id,
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

exports.getroomReservation = async (req, res) => {
  const { property_id, room_id } = req.params;

  if (!property_id || !room_id) {
    return res
      .status(200)
      .json({ message: " your room id or propertyid not found !" });
  }
  try {
    const query = `SELECT * FROM reservationroom WHERE property_id = $1 AND room_id = $2`;
    const result = await pool.query(query, [property_id, room_id]);

    return res.status(200).json({
      data: result.rows,
      message: "data fetch successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal sesrver error" });
  }
};

exports.updateRoomReservation = async (req, res) => {
  const { property_id, room_id, reserveroom_id } = req.params;
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
  try {
    const query = `SELECT * FROM reservationroom WHERE property_id = $1 AND room_id = $2`;
    const result = await pool.query(query, [property_id, room_id]);
    console.log(result.rows.length, "result row length");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Data not found to update" });
    }

    const query1 = `
    UPDATE reservationroom 
    SET name = $1, 
        email = $2, 
        phone = $3, 
        guest = $4, 
        notes = $5, 
        booking_source = $6, 
        cleaning = $7, 
        currency = $8, 
        amount = $9, 
        arrived_date = $10, 
        check_in_time = $11, 
        check_out_time = $12, 
        departure_date = $13 
    WHERE property_id = $14 AND room_id = $15 AND reserveroom_id = $16;`;
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
      room_id,
      reserveroom_id,
    ]);
    return res.status(200).json({ message: "data uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error " });
  }
};

exports.overviewsApi = async (req, res) => {
  try {
    const query = `SELECT p.property_name , p.property_id , r.room_id , r.room_no , r.rent_history , rs.reserveroom_id , rs.name , rs.email , rs.phone , rs.departure_date , rs.arrived_date , rs.guest , rs.notes , rs.booking_source , rs.cleaning , rs.currency , rs.amount , rs.check_in_time , rs.check_out_time  FROM properties p INNER JOIN room r ON p.property_id = r.property_id INNER JOIN reservationroom rs ON rs.room_id = r.room_id`;
    const result = await pool.query(query);
    const groupedData = {};

    result.rows.map((row) => {
      const { property_id, room_id } = row;

      const key = `${property_id}-${room_id}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          property_name: row.property_name,
          property_id: row.property_id,
          room_id: row.room_id,
          room_no: row.room_no,

          details: [],
        };
      }

      groupedData[key].details.push({
        reservation_id: row.reservation_id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        departure_date: row.departure_date,
        arrived_date: row.arrived_date,
        guest: row.guest,
        notes: row.notes,
        booking_source: row.booking_source,
        cleaning: row.cleaning,
        currency: row.currency,
        amount: row.amount,
        check_in_time: row.check_in_time,
        check_out_time: row.check_out_time,
      });
    });
    const formattedData = Object.values(groupedData);
    return res.status(200).json({
      data: formattedData,
      message: "data send successfully !",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
