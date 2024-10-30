const { CronJob } = require("cron");
const pool = require("../config/db.config");
const EmailService = require("./email.utils");

const sendmyemail = () =>
  async function () {
    console.log("cron job run");
    const query = `SELECT arrived_date , email , name , guest , departure_date  FROM reservationroom`;
    const result = await pool.query(query);

    result.rows.map((row) => {
      const arrivedDate = new Date(row.arrived_date);
      const currentDate = new Date();
      const differenceInMs = arrivedDate - currentDate;

      const differenceInHours = differenceInMs / (1000 * 60 * 60);
      const finalremainingdate = differenceInHours.toFixed(2);

      if (finalremainingdate > 0 && finalremainingdate < 24) {
        
        EmailService.arrivedEmail(row.email, row.name, row.arrived_date).then();

      }
    });
  };
const moveOut = ()=> async function () {
  console.log("departure email ");
  const query = `SELECT departure_date , email , name , guest , arrived_date FROM reservationroom`;
  const result = await pool.query(query);

  result.rows.map((row) => {
    const departure_date = new Date(row.departure_date);
    const current_date = new Date();
    const diffrencesInMS = departure_date - current_date;
    const diffrenceIndays = diffrencesInMS / (1000 * 60 * 60 * 24);
    const finalremainingDays = diffrenceIndays.toFixed(2);
    console.log(finalremainingDays, "diffrence in days");
     if(finalremainingDays > 0 && finalremainingDays < 30){  
        EmailService.departureEmail( row.email , row.name , row.departure_date).then()
   
     }

  });
};
moveOut();

const job = new CronJob(
  " 0 0 * * *",
  sendmyemail(),
  null,
  true,
  "America/Los_Angeles"
);

const job1 = new CronJob(
  " 0 0 1 * *",
  moveOut(),
  null,
  true,
  "America/Los_Angeles"
)

job.start();
job1.start();