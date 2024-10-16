const express = require("express");

const roomreservation = require("../controllers/roomReserve.controller");
const router = express.Router();

router.post("/property/:property_id/room/:room_id/reservation", roomreservation.roomReservation);

module.exports = router;
