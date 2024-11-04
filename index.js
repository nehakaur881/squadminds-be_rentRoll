
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");
const job = require("./Compontes/utils/cron.utils")
const job1 = require("./Compontes/utils/cron.utils")
const bodyParser = require("body-parser");
const authRoutes = require("./Compontes/routes/auth.route");
const propertyRoutes = require("./Compontes/routes/property.route");
const reportRoutes = require("./Compontes/routes/report.route");
const roomReservationRoutes = require("./Compontes/routes/reservation.routes")
const cleaingRoutes = require("./Compontes/routes/cleaing.route");
const expensiveRoutes = require("./Compontes/routes/expensive.routes")

const app = express();
app.use(cors({
  origin : "http://localhost:5173"
}));
app.use(cookieParser())
const PORT =  8000;



app.use(bodyParser.json());
app.use(express.static('images'));
// routes defined here
app.use("/api", authRoutes); 
app.use("/api" , propertyRoutes);
app.use("/api" , reportRoutes);
app.use("/api" ,  roomReservationRoutes);
app.use("/api" , cleaingRoutes);
app.use("/api" , expensiveRoutes)



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
