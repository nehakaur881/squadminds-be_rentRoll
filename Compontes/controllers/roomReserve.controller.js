const pool = require("../config/db.config");

exports.roomReservation = async (req, res) => {
  const { property_id } = req.params;
  const {
    name,
    arrived_date,
    departure_date,
    check_in_time,  
    check_out_time, 
    guest,
    notes,
    event_id,
    email,
    phone,
    booking_source,
    cleaning_id,
    currency,
    amount,
    monthly,
    cleaner,
    additional_cost,
    to_do,
    Changed,
    rent_amount,
    deposit_amount,
    payment_method,
    total_stay
  } = req.body;

  if (!property_id ) {
    return res.status(404).json({
      message: "Propertyid or roomid not found!",
    });
  }

  try {
    const query1 = `
      INSERT INTO reservationroom (
        name, email, phone, event_id, guest, notes, booking_source, cleaning_id, 
        currency, amount, arrived_date, check_in_time, check_out_time, departure_date, 
        monthly, cleaner, additional_cost, to_do, Changed, property_id, rent_amount, deposit_amount, payment_method, total_stay
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    `;

    await pool.query(query1, [
      name,
      email,
      phone,
      event_id,
      guest,
      notes,
      booking_source,
      cleaning_id,
      currency,
      amount,
      arrived_date || null,
      check_in_time || null,  
      check_out_time || null, 
      departure_date || null,
      monthly,
      cleaner,
      additional_cost,
      to_do,
      Changed,
      property_id,
      rent_amount || null,
      deposit_amount || null,
      payment_method || null,
      total_stay
    ]);

    return res.status(200).json({
      status: 200,
      message: "Room reservation data saved successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      response: error,
      message: "Internal Server Error",
    });
  }
};

exports.getroomReservation = async (req, res) => {
  const query = `
    SELECT 
      rr.*, 
      p.property_name, 
      c.email AS cleaner_email,
      c.name AS cleaner_name,
      c.cleaning_date,   
      c.todo,             
      c.maintenance      
    FROM 
      reservationroom rr
    INNER JOIN 
      properties p ON rr.property_id = p.property_id
    LEFT JOIN 
      cleaning c ON rr.reservation_id = c.reserveroom_id 
  `;

  try {
    const reservationroom = await pool.query(query);
    res.status(200).json({
      success: true,
      data: reservationroom.rows,
      message: "Reservation room fetched successfully",
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

exports.updateRoomReservation = async (req, res) => {
  const { property_id, reservation_id } = req.params;
  const {
    name,
    arrived_date,
    departure_date,
    check_in_time,
    check_out_time,
    guest,
    notes,
    event_id,
    email,
    phone,
    booking_source,
    currency,
    amount,
    monthly,
    cleaner,
    additional_cost,
    to_do,
    rent_amount,
    deposit_amount,
    payment_method,
    total_stay,
  } = req.body;


  const guestCount = parseInt(guest, 10);

  try {
    const query = `SELECT * FROM reservationroom WHERE property_id = $1 AND reservation_id = $2`;
    const result = await pool.query(query, [
      property_id,
      reservation_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found to update" });
    }

    const query1 = `
      UPDATE reservationroom 
      SET 
        name = $1, 
        email = $2, 
        phone = $3, 
        guest = $4, 
        notes = $5, 
        booking_source = $6,   
        currency = $7, 
        amount = $8, 
        arrived_date = $9, 
        check_in_time = $10, 
        check_out_time = $11, 
        departure_date = $12,
        event_id = $13,
        monthly = $14,
        cleaner = $15,
        additional_cost = $16,
        to_do = $17,
        rent_amount = $18,
        deposit_amount = $19,
        payment_method = $20,
        total_stay = $21
      WHERE property_id = $22  AND reservation_id = $23`;

    await pool.query(query1, [
      name,
      email,
      phone,
      guestCount || null,
      notes,
      booking_source,
      currency,
      amount || null,
      arrived_date || null,
      check_in_time || null,
      check_out_time || null,
      departure_date || null,
      event_id || null,
      monthly || null,
      cleaner,
      additional_cost || null,
      to_do || null,
      rent_amount || null, 
      deposit_amount || null, 
      payment_method || null, 
      total_stay || null, 
      property_id,
      reservation_id,
    ]);

    const updatedReservation = await pool.query(`
      SELECT * FROM reservationroom 
      WHERE property_id = $1  AND reservation_id = $2
    `, [
      property_id,
      
      reservation_id,
    ]);


    return res.status(200).json({
      message: "Data uploaded successfully",
      status: 200,
      success: true,
      data: updatedReservation.rows[0], 
    });
  } catch (error) {
    console.log("Error updating reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.overviewsApi = async (req, res) => {
  try {
    const query = `
  SELECT 
    p.property_name, 
    p.property_id,  
    rs.reservation_id, 
    rs.name, 
    rs.email, 
    rs.phone, 
    rs.departure_date, 
    rs.arrived_date, 
    rs.guest, 
    rs.notes, 
    rs.booking_source, 
    rs.cleaning_id, 
    rs.cleaner, 
    rs.currency, 
    rs.amount, 
    rs.check_in_time, 
    rs.check_out_time,
    r.room_id,
    r.room_no
  FROM 
    properties p 
  LEFT JOIN 
    reservationroom rs ON rs.property_id = p.property_id
  LEFT JOIN 
    room r ON r.property_id = p.property_id`;

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
