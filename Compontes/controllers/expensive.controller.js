const pool = require("../config/db.config");

exports.expenseList = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(404).json({
      message: "User not valid!",
    });
  }

  try {
    const query = `SELECT p.property_name , p.property_id , r.room_no , rr.arrived_date, rr.departure_date, rr.amount, rr.room_id  FROM properties p INNER JOIN room r ON p.property_id = r.property_id INNER JOIN reservationroom rr ON rr.room_id = r.room_id`;
    const result = await pool.query(query, []);

    const groupedData = {};

    result.rows.map((row) => {
      const {
        room_id,
        arrived_date,
        departure_date,
        amount,
        property_id,
        property_name,
        room_no,
      } = row;

      if (!arrived_date || !departure_date || !amount) return;

      const arrived = new Date(arrived_date);
      const departure = new Date(departure_date);
      const key = `${room_id}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          property_id: property_id,
          property_name: property_name,
          room_no: room_no,
          room_id: room_id,
          occupiedDaysByMonth: {},
          occupiedPercentageByMonth: {},
          totalAmountByMonth: {},
          avgDailyRentByMonth: {},
        };
      }

      let currentDate = new Date(arrived);

      while (currentDate <= departure) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const monthYearKey = `${year}-${month.toString().padStart(2, "0")}`;

        if (!groupedData[key].occupiedDaysByMonth[monthYearKey]) {
          groupedData[key].occupiedDaysByMonth[monthYearKey] = 0;
          groupedData[key].totalAmountByMonth[monthYearKey] = 0;
        }
        groupedData[key].occupiedDaysByMonth[monthYearKey] += 1;

        const totalDaysInStay =
          (departure - arrived) / (1000 * 60 * 60 * 24) + 1;
        const dailyAmount = amount / totalDaysInStay;

        groupedData[key].totalAmountByMonth[monthYearKey] += dailyAmount;

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    Object.keys(groupedData).forEach((roomKey) => {
      const roomData = groupedData[roomKey];
      Object.keys(roomData.occupiedDaysByMonth).forEach((monthYearKey) => {
        const [year, month] = monthYearKey.split("-");
        const totalDaysInMonth = new Date(year, month, 0).getDate();
        const occupiedDays = roomData.occupiedDaysByMonth[monthYearKey];
        const occupancyRate = (occupiedDays / totalDaysInMonth) * 100;
        roomData.occupiedPercentageByMonth[monthYearKey] =
          occupancyRate.toFixed(2);

        const totalAmount = roomData.totalAmountByMonth[monthYearKey];
        const avgDailyRent = totalAmount / occupiedDays;
        roomData.avgDailyRentByMonth[monthYearKey] = avgDailyRent.toFixed(2);
      });
    });

    const formatData = Object.values(groupedData);

    return res.status(200).json({
      message: formatData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.addExpenseList = async (req, res) => {
 
  const { property_id } = req.params;
  const { title, date, description } = req.body;
  if (!property_id) {
    return res.status(404).json({
      message: "data not Found",
    });
  }
  const files = req.file;
  let filesUrl = null;
  try {
    if (files) {
      filesUrl = `${process.env.BACKEND_URL}/uploads/${files.filename}`;
      console.log("filesUrl", files.filename);
    }
    const query = `INSERT INTO expense(title, date, property_id,
     files, description) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(query, [
      JSON.stringify(title),
      date,
      property_id,
      filesUrl,
      description,
    ]);

    return res.status(200).json({
      data: result.rows,
      message: "Expense data sent successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getExpenseList = async (req, res) => {
  try {
    const query = ` SELECT
    e.expense_id,
    e.property_id,
    e.title,
    e.date,
    e.files,
    e.description,
    e.created_at,
    p.property_name
  FROM
    expense e
  JOIN
  properties p ON e.property_id = p.property_id;
  `;
    const result = await pool.query(query);
    return res.status(200).json({
      status: 200,
      data: result.rows,
      message: "Data fetch Successfully !",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Interval Server Error",
    });
  }
};

exports.updateExpenseList = async (req, res) => {
  const { expense_id } = req.params;
  if (!expense_id) {
    return res
      .status(404)
      .json({ message: "expense_id is required" });
  }
  const { title, date, description, property_id, invoice } = req.body;
  const filesData = req.file;  
  let filesUrl = null;
  try {
    if (filesData) {
      filesUrl = `${process.env.BACKEND_URL}/uploads/${filesData.filename}`;
     
    }
    else if (invoice) {
      filesUrl = invoice; 
    }
    const query = `UPDATE expense SET title = $1, date = $2, description = $3, files = $4, property_id = $5 WHERE expense_id = $6`;
    const result = await pool.query(query, [
      title,
      date,
      description,
      filesUrl || null,
      property_id,
      expense_id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "expense not found to update" });
    }
    return res.status(200).json({
      message: "expense updated successfully",
    });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ messsage: "internal server error" });
  }
};
