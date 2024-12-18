const { CronJob } = require("cron");
const pool = require("../config/db.config");
const EmailService = require("./email.utils");

const sendmyemail = () =>
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
        EmailService.arrivedEmail(row.email, row.name, row.arrived_date).then();
      }
      
    });
  };
const moveOut = () =>
  async function () {
    try {
      const query = `SELECT departure_date , email , name , guest , arrived_date FROM reservationroom`;
      const result = await pool.query(query);

      result.rows.map((row) => {
        const departure_date = new Date(row.departure_date);
        const current_date = new Date();
        const diffrencesInMS = departure_date - current_date;
        const diffrenceIndays = diffrencesInMS / (1000 * 60 * 60 * 24);
        const finalremainingDays = diffrenceIndays.toFixed(2);

        if (finalremainingDays > 0 && finalremainingDays < 30) {
          EmailService.departureEmail(
            row.email,
            row.name,
            row.departure_date
          ).then();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
moveOut();



const cleanerEmail = () =>
  async function () {
    try {
      const query = `SELECT rr.cleaner , rr.departure_date , r.property_id , r.room_id , r.room_no FROM reservationroom rr INNER JOIN room r ON r.room_id = rr.room_id  `;
      const result = await pool.query(query);

      result.rows.map((row) => {
        const departure = new Date(row.departure_date);
        const currentDate = new Date();
        const diffrenceInMs = departure - currentDate;
        const diffrenceInHours = (diffrenceInMs / (1000 * 60 * 60 * 24)).toFixed(2)
        if (diffrenceInHours > 0 && diffrenceInHours < 1) {
          if (row.cleaner === "true") {
            return
          }
          EmailService.cleanerEmail(
            row.cleaning,
            row.departure_date,
            row.property_id,
            row.room_id,
          ).then()
        }
      })
    } catch (error) {
      console.log(error);
    }
  };

const manualCleanerEmail = () =>
  async function () {
    try {
      const query = `SELECT 
  cleaning.email, 
  cleaning.name, 
  cleaning.cleaning_date, 
  room.room_no, 
  properties.property_name
FROM cleaning
INNER JOIN reservationroom rr ON rr.reservation_id = cleaning.reserveroom_id
INNER JOIN room ON rr.room_id = room.room_id
INNER JOIN properties ON room.property_id = properties.property_id; 
`;
      const result = await pool.query(query);
    
      result.rows.map((row) => {
        const cleaning = new Date(row.cleaning_date).toLocaleDateString('en-CA');;

        const currentDate = new Date().toLocaleDateString('en-CA');;

        if (cleaning === currentDate) {
          EmailService.manualCleanerEmail(
            row.email,
            row.name,
            row.room_no,
            row.property_name
          )
        }
      });
    } catch (error) {
      console.error(error)
    }
  };
manualCleanerEmail()

const job = new CronJob(
  " 0 0 * * *",
  sendmyemail(),
  null,
  true,
  "America/Los_Angeles"
);

const job1 = new CronJob(
  "0 0 1 * *",
  moveOut(),
  null,
  true,
  "America/Los_Angeles"
);

const job2 = new CronJob(
  "0 1 * * *",
  cleanerEmail(),
  null,
  true,
  "America/Los_Angeles"
);

const job3 = new CronJob(
  "0 0 * * *",
  manualCleanerEmail(),
  null,
  true,
  "America/Los_Angeles"
)

job.start();
job1.start();
job2.start();
job3.start();