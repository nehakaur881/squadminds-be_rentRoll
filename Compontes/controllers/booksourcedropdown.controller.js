const pool = require("../config/db.config");
 
exports.addbookingdropDownData = async (req, res) => {
  const { booking_source, payment_method } = req.body;
  console.log(booking_source , "booking_source")
  if (!booking_source) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Data not found !!",
    });
  }
  try {
    const query = `INSERT INTO dropdown (booking_source , payment_method )  VALUES($1 , $2  ) Returning *`;
    const result = pool.query(query, [booking_source , payment_method]);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Data add successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.updateBookingData = async (req, res) => {
  const { booking_source , payment_method } = req.body;
  const { dropdown_id } = req.params;

  if (!dropdown_id) {
    return res.status(404)({
      status: 404,
      success: false,
      message: "ID not found !!",
    });
  }  
  try {
    const query = `UPDATE dropdown SET booking_source = $1 , payment_method = $2 WHERE dropdown_id = $3`;
    const result = await pool.query(query, [booking_source, payment_method , dropdown_id]);

    if (result.rows === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Data not found to update !! ",
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Data updated successfully !!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: true,
      message: "internal Server Error !!",
      error: error.stack,
    });
  }
};

exports.getdropdownData = async (req, res) => {
  try {
    const query = `SELECT * FROM dropdown`;
    const result = await pool.query(query);

    if (result.rows === 0 || undefined || null) {
      return res.status(404).json({
        success: false,
        status: true,
        message: "No data found !",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      data: result.rows,
      message: "data send successfully ! ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: true,
      message: "internal Server Error !!",
      error: error.stack,
    });
  }
};

exports.deletebookingdata = async (req, res) => {
  const { dropdown_id } = req.params;

  if (!dropdown_id) {
    return res.status(404)({
      status: 404,
      success: false,
      message: "ID not found !!",
    });
  }
  try {
    const query = `DELETE FROM dropdown where dropdown_id = $1 RETURNING *`;
    await pool.query(query, [dropdown_id]);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Data Deleted !",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: true,
      message: "internal Server Error !!",
      error: error.stack,
    });
  }
};


