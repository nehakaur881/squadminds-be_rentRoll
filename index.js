// ------------------------------------------
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth.route");
const propertyRoutes = require("./src/routes/property.route");
const reportRoutes = require("./src/routes/report.routes");
const roomReservationRoutes = require("./src/routes/roomReservation.routes")

const app = express();
app.use(cors({
  origin : "http://localhost:5173"
}));
app.use(cookieParser())
const PORT = 8000;

app.use(bodyParser.json());

// routes defined here 
app.use("/api", authRoutes); 
app.use("/api" , propertyRoutes)
app.use("/api" , reportRoutes)
app.use("/api" ,  roomReservationRoutes)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});









// const express = require('express');
// const pg = require('pg');
// const cors = require('cors')
// const bcrypt = require('bcrypt');
// const cookieParser =  require('cookie-parser')
// const {pool} = require('./config/database')
// require('dotenv').config();

// const app = express();
// app.use(cors())
// app.use(express.json());
// app.use(cookieParser());

// const login =  require('./routes/userRoutes')
// const forgotPassword =  require('./routes/userRoutes')
// const resetPassword =  require('./routes/userRoutes')
// const admin =  require('./routes/userRoutes')
// const protected =  require('./routes/userRoutes')
// const roomData = require('./routes/userRoutes')
// const getRoomData = require("./routes/userRoutes")


// const PORT = process.env.PORT;

// app.use('/api', admin)
// app.use('/api', login)
// app.use('/api', forgotPassword)
// app.use('/api', resetPassword)
// app.use('/api', protected)
// app.use('/api' , roomData)
// app.use('/api' , getRoomData)


// app.listen(PORT, () => {
//     console.log(`Server is Running at ${PORT}...`)
// })
