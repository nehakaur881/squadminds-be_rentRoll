 const express = require('express');
 const router = express.Router()
 const booksourcedropdown = require("../controllers/booksourcedropdown.controller")

const pool =  require('../config/db.config')

router.get("/getdrop-down" , booksourcedropdown.getdropdownData);
router.post("/add-drop-down" , booksourcedropdown.addbookingdropDownData);
router.put("/update-booking-source/:dropdown_id" , booksourcedropdown.updateBookingData)
router.delete("/delete-booking-source/:dropdown_id" , booksourcedropdown.deletebookingdata)

module.exports =  router;