const express = require('express');
const pg = require('pg');
const cors = require('cors')
const bcrypt = require('bcrypt');
const cookieParser =  require('cookie-parser')
const {pool} = require('./config/database')
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());

const login =  require('./routes/userRoutes')
const forgotPassword =  require('./routes/userRoutes')
const resetPassword =  require('./routes/userRoutes')
const admin =  require('./routes/userRoutes')
const protected =  require('./routes/userRoutes')
const roomData = require('./routes/userRoutes')


const PORT = process.env.PORT;

app.use('/api', admin)
app.use('/api', login)
app.use('/api', forgotPassword)
app.use('/api', resetPassword)
app.use('/api', protected)
app.use('/api' , roomData)


app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}...`)
})

