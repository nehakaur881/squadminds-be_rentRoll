const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  "development": {
    "username": process.env.VITE_POSTGRESS_USER,
    "password": process.env.VITE_POSTGRESS_PASSWORD,
    "database": process.env.VITE_POSTGRESS_DATABASE,
    "host": process.env.VITE_POSTGRESS_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.VITE_POSTGRESS_USER,
    "password": process.env.VITE_POSTGRESS_PASSWORD,
    "database": process.env.VITE_POSTGRESS_DATABASE,
    "host": process.env.VITE_POSTGRESS_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.VITE_POSTGRESS_USER,
    "password": process.env.VITE_POSTGRESS_PASSWORD,
    "database": process.env.VITE_POSTGRESS_DATABASE,
    "host": process.env.VITE_POSTGRESS_HOST,
    "dialect": "postgres"
  }
}
