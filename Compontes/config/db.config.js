const { Pool } = require("pg");


const pool = new Pool({
    user: process.env.VITE_POSTGRESS_USER,
    host: process.env.VITE_POSTGRESS_HOST,
    database: process.env.VITE_POSTGRESS_DATABASE,
    password: process.env.VITE_POSTGRESS_PASSWORD,
    port: process.env.VITE_POSTGRESS_PORT,
  });

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = pool;
