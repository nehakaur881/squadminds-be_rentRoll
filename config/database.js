const pg = require('pg')

pool = new pg.Pool({
    user: "priyanka",
    host: "localhost",
    database: "rentroll",
    password: "priyanka",
    port: 5432
})

pool.connect((error) => {
    if (error) {
        console.log("DB Not Connect???")
    }
    else {
        console.log("DB Connected Successsfully...")
    }
})

module.exports = pool;