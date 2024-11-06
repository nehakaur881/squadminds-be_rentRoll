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
    console.log(result.rows, "result rows");

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
  const { room_id  } = req.params;
  const { token } = req.cookies;
  const { title, date , files } = req.body;  
  

  if (!token) {
    return res.status(404).json({
      message: "User not Found",
    });
  }

  try {
    const query = `INSERT INTO expense(title, date , files ,room_id) VALUES($1, $2, $3 , $4 ) RETURNING *`;
    const result = await pool.query(query, [JSON.stringify(title), date , files ,room_id]);
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

