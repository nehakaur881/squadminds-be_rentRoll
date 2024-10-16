const express = require('express');
const cors = require('cors');
const cookieParser =  require('cookie-parser')
const {pool} = require('./config/database')
require('dotenv').config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());

const login =  require('./routes/userRoutes')
const forgotPassword =  require('./routes/userRoutes')
const resetPassword =  require('./routes/userRoutes')
const admin =  require('./routes/userRoutes')
const protected =  require('./routes/userRoutes')
const logout = require('./routes/userRoutes')
const addProperties =  require('./routes/userRoutes')
const getProperties =  require('./routes/userRoutes')
const deleteProperties = require('./routes/userRoutes')
const updateProperties = require('./routes/userRoutes')
const roomData = require('./routes/userRoutes')
const getRoomData = require("./routes/userRoutes")
const updateRoomData = require("./routes/userRoutes");
const deleteRoom  = require('./routes/userRoutes');
const PORT = process.env.PORT;

app.use('/api', admin)
app.use('/api', login)
app.use('/api', forgotPassword)
app.use('/api', resetPassword)
app.use('/api', protected)
app.use('/api', logout)
app.use('/api', addProperties)
app.use('/api', getProperties)
app.use('/api', deleteProperties)
app.use('/api', updateProperties)
app.use('/api' , roomData)
app.use('/api' , getRoomData)
app.use('/api' , updateRoomData)
app.use('/api' , deleteRoom)

app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}...`)
})

