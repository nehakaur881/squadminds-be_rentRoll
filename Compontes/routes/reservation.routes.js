const express = require("express");

const roomreservation = require("../controllers/roomReserve.controller");
const router = express.Router();

router.post("/property/:property_id/reservation", roomreservation.roomReservation);
router.get("/getroomReservation" , roomreservation.getroomReservation);
router.put("/property/:property_id/updateRoomReservation/:reservation_id" , roomreservation.updateRoomReservation)
router.get("/overviewsApi" , roomreservation.overviewsApi)

module.exports = router;
