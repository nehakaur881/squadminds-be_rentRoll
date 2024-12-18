const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");
const job = require("./Compontes/utils/cron.utils");
const job1 = require("./Compontes/utils/cron.utils");
const bodyParser = require("body-parser");
const authRoutes = require("./Compontes/routes/auth.route");
const propertyRoutes = require("./Compontes/routes/property.route");
const reportRoutes = require("./Compontes/routes/report.route");
const roomReservationRoutes = require("./Compontes/routes/reservation.routes");
const cleaingRoutes = require("./Compontes/routes/cleaing.route");
const expensiveRoutes = require("./Compontes/routes/expensive.routes");
const booksourcedropdown = require("./Compontes/routes/booksourcedropdown.route");


const app = express();
app.use(cors({
  origin : [  "http://192.168.1.22:8000/api" , "http://localhost:3000"]
}));
app.use(cookieParser())
const PORT =  8000;

app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, './build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './build', 'index.html'));
// });

app.use(express.static('images'));

app.use("/api", authRoutes); 
app.use("/api" , propertyRoutes);
app.use("/api" , reportRoutes);
app.use("/api" ,  roomReservationRoutes);
app.use("/api" , cleaingRoutes);
app.use("/api" , expensiveRoutes);
app.use("/api" , booksourcedropdown);


app.listen(PORT, () => {
  console.log(`server is running on ${PORT}` )
});
