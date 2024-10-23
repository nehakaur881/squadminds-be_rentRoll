const { CronJob } = require("cron");
const pool = require("../config/db.config");
const EmailService = require("./email.utils");

const job = new CronJob(
  " 0 0 * * *",
  async function () {
    
    const query = `SELECT arrived_date , email , name , guest , departure_date  FROM reservationroom`;
    const result = await pool.query(query);

    result.rows.map((row) => {
      const arrivedDate = new Date(row.arrived_date);
      const currentDate = new Date();
      const differenceInMs = arrivedDate - currentDate;

      const differenceInHours = differenceInMs / (1000 * 60 * 60);
      const finalremainingdate = differenceInHours.toFixed(2);

      if (finalremainingdate > 0 && finalremainingdate < 24) {
        EmailService.arrivedEmail(row.email, row.name, row.arrived_date);
      }
    });
  },
  null,
  true,
  "America/Los_Angeles"
);
