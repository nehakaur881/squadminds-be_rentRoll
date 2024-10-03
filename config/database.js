const pg = require('pg')

pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "Squad",
    password: "Kamlesh@123",
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