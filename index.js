const express = require('express');
const pg = require('pg');
const cors = require('cors')
const bcrypt = require('bcrypt');

const {pool} = require('./config/database')
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());

const login =  require('./routes/userRoutes')
const sendotp =  require('./routes/userRoutes')
const resetPassword =  require('./routes/userRoutes')
const admin =  require('./routes/userRoutes')


const PORT = process.env.PORT;

app.use('/api', admin)
app.use('/api', login)
app.use('/api', sendotp)
app.use('/api', resetPassword)


app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}...`)
})

