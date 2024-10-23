const express = require("express");

const roomreservation = require("../controllers/roomReserve.controller");
const router = express.Router();

router.post("/property/:property_id/room/:room_id/reservation", roomreservation.roomReservation);
router.get("/property/:property_id/room/:room_id/getreservedata" , roomreservation.getroomReservation);
router.patch("/property/:property_id/room/:room_id/updateroomreserve/:reserveroom_id" , roomreservation.updateRoomReservation)
router.get("/overviewsApi" , roomreservation.overviewsApi)

module.exports = router;
